const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Validación de Seguridad
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: La variable de entorno GEMINI_API_KEY no está definida.");
  process.exit(1);
}

// 2. Configuración de Modelos (Patrón Fallback)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const jsonConfig = { generationConfig: { responseMimeType: "application/json" } };

// Inicializamos AMBOS motores
const modeloPrimario = genAI.getGenerativeModel({ model: "gemini-flash-latest", ...jsonConfig });
const modeloSecundario = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", ...jsonConfig });

// Bandera global para el enrutamiento
let usarModeloSecundario = false;

const HN_URL = 'https://hacker-news.firebaseio.com/v0';
const CATEGORIAS = ["Desarrollo de Software", "IA", "Ciberseguridad", "Distribuciones Linux", "Ciencia y Matematica", "Hardware", "Frontend"];

// 3. Función de Deep Scraping
async function extraerContenido(url) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });
    const $ = cheerio.load(data);
    // Limpiamos etiquetas innecesarias y extraemos el texto puro
    $('script, style, nav, footer, iframe').remove();
    const texto = $('p').text().replace(/\s+/g, ' ').trim();
    return texto.substring(0, 4000); // Límite para no saturar el contexto
  } catch (error) {
    return null; // En caso de bloqueo por CORS o protección antibots
  }
}

// 4. Procesamiento con IA con Resiliencia (Retry + Fallback)
async function procesarNoticiaConIA(hnItem) {
  if (!hnItem.url) return null;

  console.log(`[Scraping] Analizando: ${hnItem.title}...`);
  const contenido = await extraerContenido(hnItem.url);
  
  if (!contenido || contenido.length < 150) {
    console.log(`   └─ [Omitido] Contenido bloqueado o insuficiente.`);
    return null;
  }

  const prompt = `
    Eres un Arquitecto de Software Senior. Lee este artículo:
    "${contenido}"
    
    Tu tarea:
    1. Determina si el artículo trata PRINCIPALMENTE sobre una de estas categorías: ${CATEGORIAS.join(', ')}.
    2. Si NO encaja en ninguna, devuelve exactamente: {"valido": false}
    3. Si encaja, devuelve un objeto JSON estricto:
    {
      "valido": true,
      "titulo_es": "Traducción al español del título original",
      "resumen": "Resumen técnico claro y detallado.",
      "categoria": "Una sola categoría exacta de la lista"
    }
  `;

  let rawText = "";
  let exito = false;
  let intentos = 0;
  const MAX_INTENTOS = 2; // 2 reintentos extra tras el primer fallo = 3 intentos totales

  // Bucle de resiliencia
  while (intentos <= MAX_INTENTOS && !exito) {
    try {
      // Seleccionamos el motor según el estado del 'switch' global
      const modeloActual = usarModeloSecundario ? modeloSecundario : modeloPrimario;
      const result = await modeloActual.generateContent(prompt);
      rawText = result.response.text();
      exito = true; // Si llegamos aquí, la petición triunfó
      
    } catch (err) {
      if (err.message.includes("429")) {
        // Error de Cuota Agotada
        if (!usarModeloSecundario) {console.log(`\n=============================================================`);
          console.log(` ⚠️ [CAMBIO DE MOTOR] Límite diario de 'Latest' alcanzado.`);
          console.log(` 🚀 Activando Respaldo: Continuamos con Gemini Flash-Lite...`);
          console.log(`=============================================================\n`);
          usarModeloSecundario = true;
          // IMPORTANTE: No sumamos 'intentos' aquí. Simplemente el bucle vuelve a girar
          // e intenta inmediatamente la misma noticia con el motor Lite.
        } else {
          console.log(`   ❌ [Error Crítico] Cuota agotada también en el modelo Lite. Abortando noticia.`);
          return null; 
        }
      } 
      else if (err.message.includes("503")) {
        // Error de Congestión Temporal
        intentos++;
        if (intentos <= MAX_INTENTOS) {
          const motorActualStr = usarModeloSecundario ? "Lite" : "Latest";
          console.log(`   🔄 [Reintento ${intentos}/${MAX_INTENTOS}] Servidor ${motorActualStr} saturado (503). Pausa táctica de 15s...`);
          await esperar(15000); // Pausa larga para dejar que el servidor de Google se recupere
        } else {
          console.log(`   └─ [Omitido] Imposible procesar tras varios intentos por alta demanda (503).`);
          return null; // Nos rendimos con esta noticia y pasamos a la siguiente
        }
      } 
      else {
        // Errores de parseo o de red desconocidos
        console.log(`   └─ ❌ [Error IA]: ${err.message}`);
        return null;
      }
    }
  }

  // Si después del bucle no hubo éxito, salimos
  if (!exito) return null;

  // Limpieza de formato y parsing (Clean Code)
  try {
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const iaResponse = JSON.parse(rawText);
    
    if (iaResponse.valido) {
      return {
        id: hnItem.id,
        url: hnItem.url,
        score: hnItem.score,
        time: hnItem.time,
        titulo_es: iaResponse.titulo_es,
        resumen: iaResponse.resumen,
        categoria: iaResponse.categoria
      };
    } else {
       console.log(`   └─ [Descartada] Fuera de las categorías de interés.`);
       return null;
    }
  } catch (parseError) {
    console.log(`   └─ ❌ [Error de Formato JSON]: La IA no devolvió un JSON válido.`);
    return null;
  }
}

// Función auxiliar para pausar la ejecución (Patrón Sleep)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 5. Orquestador Principal Optimizado
async function iniciarCuracion() {
  console.log("🚀 Iniciando curación de noticias con Gemini 2.0 Flash Latest (15 RequestPerMinute Limit)...\n");
  
  // REDUCIDO A 3 PARA PRUEBAS (Evitamos gastar cuota innecesaria)
  const { data: topIds } = await axios.get(`${HN_URL}/topstories.json`);
  const limitIds = topIds.slice(0, 50); 

  console.log(`📥 Analizando las primeras ${limitIds.length} noticias de HackerNews...`);
  
  const itemsCrudos = await Promise.all(
    limitIds.map(id => axios.get(`${HN_URL}/item/${id}.json`).then(res => res.data))
  );

  const noticiasAprobadas = [];
  let contadorAprobadas = 0;
  
  // Procesamiento regulado (Throttling)
  for (let i = 0; i < itemsCrudos.length; i++) {
    const item = itemsCrudos[i];
    
    if (item && item.type === 'story') {
      const noticiaProcesada = await procesarNoticiaConIA(item);
      
      if (noticiaProcesada) {
        noticiasAprobadas.push(noticiaProcesada);
        contadorAprobadas++;
        // Contador progresivo en tiempo real
        console.log(`   ✅ [${noticiaProcesada.categoria}] Guardada con éxito. (Total guardadas: ${contadorAprobadas})\n`);
      }

      // Si no es el último elemento, obligamos al script a pausar 8 segundos
      if (i < itemsCrudos.length - 1) {
        console.log(`   ⏳ Esperando 8 segundos para respetar los límites de la API...`);
        await esperar(8000); 
      }
    }
  }

  // Guardado en la estructura de Angular
  const dirPath = path.join(__dirname, '../src/assets/data');
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  
  fs.writeFileSync(path.join(dirPath, 'news.json'), JSON.stringify(noticiasAprobadas, null, 2));
  console.log(`\n🎉 Proceso finalizado. ${noticiasAprobadas.length} noticias curadas en src/assets/data/news.json`);
}

iniciarCuracion();