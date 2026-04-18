# Portafolio Profesional: Arquitectura Angular Híbrida & Automatización con IA

Este proyecto representa una implementación de ingeniería utilizando **Angular 21**, diseñada bajo un modelo de **Arquitectura Híbrida** que optimiza la entrega de contenido y la interactividad mediante la combinación de SSR y CSR.

## 🏗️ Arquitectura de Renderizado Híbrido
A diferencia de las aplicaciones tradicionales, este proyecto utiliza un flujo de renderizado optimizado:

1.  **SSR (Server-Side Rendering):** El servidor genera el HTML inicial de forma síncrona. Esto garantiza que el contenido (noticias, portafolio, divisas) esté disponible inmediatamente para motores de búsqueda (SEO) y usuarios con conexiones lentas.

2.  **Hidratación de Cliente:** Una vez que el navegador carga el bundle de JavaScript, la aplicación realiza el proceso de hidratación, transformando el HTML estático en una SPA (Single Page Application) interactiva.

3.  **CSR (Client-Side Rendering):** Tras la carga inicial, toda la navegación y gestión de estados se maneja dinámicamente en el cliente, proporcionando una experiencia de usuario fluida y sin recargas de página.

## 🤖 Automatización e Inteligencia Artificial
-  **Agente de Curación IA:** Script especializado en Node.js (scripts/curar-noticias.js) que actúa como puente ETL, integrando la API de HackerNews con la API de Gemini (Vertex AI).

-  **Procesamiento Autónomo:** El agente utiliza la IA para filtrar, categorizar y resumir noticias de tecnología, almacenando los resultados en news.json de forma diaria.

-  **Pipeline de Datos:** Los cambios son detectados por el sistema de CI/CD para mantener el estado de la aplicación siempre actualizado.

## ⚙️ DevOps y Tooling Local
Se han implementado flujos de trabajo específicos para mantener la integridad del repositorio y sincronizar la automatización del bot de noticias.

-  **CI/CD (GitHub Actions)**
deploy.yml: Automatiza la compilación y publicación en GitHub Pages.

update-news.yml: Ejecuta el Cron Job diario para la actualización de datos mediante IA.

-  **Herramientas de Consola (Bash Scripts)**
Para garantizar la integridad del repositorio y automatizar el paso a producción de cualquier cambio se debe utilizar el siguiente comando personalizado
| 👉 Comando: bash sMain.sh "tu mensaje aquí" | 
Sincroniza el local descargando el archivo con los datos de depurados por la IA y carga los cambios a la rama principal, lo que activa el despliegue automático hacia la web.

## 🛠 Flujo de Trabajo del Equipo (Git Workflow)
Este proyecto utiliza Trunk-Based Development. Para evitar conflictos de historial y mantener una línea de tiempo limpia, todo el equipo debe adherirse estrictamente al siguiente flujo directo a producción:

### 🚨 Reglas de Prevención y Pruebas Locales
Para evitar historiales contaminados y despliegues fallidos, es obligatorio seguir estas normas antes de subir código:

Pruebas en Múltiples Dispositivos (Mobile/Tablet): Está estrictamente prohibido usar la rama de producción para probar UI. Utiliza el servidor local expuesto a la red Wi-Fi.
|👉 Comando: ng serve --host 0.0.0.0|
(Accede desde cualquier dispositivo ingresando la IP local de tu PC, ej: 192.168.1.x:4200)

Puntos de Restauración (Savepoints): Si vas a realizar una refactorización crítica o un rediseño agresivo, CREA UN MENSAJE DE COMMIT EXPLICITO Y DE ADVERTENCIA DE FACIL UBICACION.
|👉 Comando: bash sMain "BREAKING CHANGE: mensaje explícito de tu rediseño crítico"|

Flujo de Trabajo Estandarizado (Uso Diario)
Rama base: Todo el desarrollo local se realiza SIEMPRE sobre la rama local develop.

Sincronizar y Subir: Cuando termines una funcionalidad probada localmente, ejecuta el script en la raíz del proyecto para mandarlo a producción (main):
|👉 Comando: bash sMain.sh "feat: descripción de tu código terminado"|

## ⚠️ Excepción: Tareas Largas o Compartidas (WIP)
Solo en casos esporádicos donde necesites delegar o compartir código incompleto con otro compañero sin afectar la página web oficial o el desarrollo vaya a tomar mucho tiempo, utilizaremos la rama remota origin develop:

Para enviar (respaldar o compartir):
``|👉 Comando: git push origin develop|``

Para recibir (descargar el avance):
|👉 Comando: git pull origin develop --rebase|

## Limpieza obligatoria:
Una vez el trabajo se complete y se suba a producción usando sMain.s, se debe borrar la rama remota para mantener el repositorio limpio:
|👉 Comando: git push origin --delete develop|

* **Pruebas Unitarias:** ```    
    bash ng test```

* **Pruebas Unitarias:** ``    
    bash ng test```

* **Pruebas Unitarias:** `    
    probando```bash ng test