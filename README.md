# Portafolio Profesional: Arquitectura Angular Híbrida & Automatización con IA

Este proyecto representa una implementación de ingeniería avanzada utilizando **Angular 21**, diseñada bajo un modelo de **Arquitectura Híbrida** que optimiza la entrega de contenido y la interactividad mediante la combinación de SSR y CSR.

## 🏗️ Arquitectura de Renderizado Híbrido
A diferencia de las aplicaciones tradicionales, este proyecto utiliza un flujo de renderizado optimizado:

1.  **SSR (Server-Side Rendering):** El servidor genera el HTML inicial de forma síncrona. Esto garantiza que el contenido (noticias, portafolio, divisas) esté disponible inmediatamente para motores de búsqueda (SEO) y usuarios con conexiones lentas.
2.  **Hidratación de Cliente:** Una vez que el navegador carga el bundle de JavaScript, la aplicación realiza el proceso de hidratación, transformando el HTML estático en una **SPA (Single Page Application)** interactiva.
3.  **CSR (Client-Side Rendering):** Tras la carga inicial, toda la navegación y gestión de estados se maneja dinámicamente en el cliente, proporcionando una experiencia de usuario fluida y sin recargas de página.

## 🤖 Automatización e Inteligencia Artificial
* **Agente de Curación IA:** Script especializado en Node.js (`scripts/curar-noticias.js`) que integra la **API de Gemini (Vertex AI)**.
* **Procesamiento Autónomo:** El agente filtra, categoriza y resume noticias de tecnología, almacenando los resultados en `news.json` de forma diaria.
* **Pipeline de Datos:** Los cambios son detectados por el sistema de CI/CD para mantener el estado de la aplicación siempre actualizado.

## ⚙️ DevOps y Tooling Local
Se han implementado flujos de trabajo específicos para resolver la divergencia de ramas causada por la automatización del bot de noticias.

### CI/CD (GitHub Actions)
* **`deploy.yml`:** Automatiza la compilación y publicación en GitHub Pages.
* **`update-news.yml`:** Ejecuta el Cron Job diario para la actualización de datos mediante IA.

### Herramientas de Consola (Bash Scripts)
Para mantener la integridad del repositorio local, se deben utilizar los siguientes comandos personalizados:

* **Sincronización de Datos (`bash sDev.sh`):**
    Prepara el entorno local descargando las actualizaciones que el bot de IA realizó en la nube hacia la rama de desarrollo. Evita conflictos de árbol Git.
* **Despliegue y Commit (`bash sMain.sh "mensaje"`):**
    Sincroniza el desarrollo local, realiza el merge a la rama principal y activa el despliegue automático hacia la web.

## 🛠️ Stack Tecnológico
* **Framework:** Angular 21 (Standalone Components).
* **Estilos:** CSS3 con metodología modular.
* **Backend & API:** Node.js (Scripts), Gemini API.
* **Performance:** Angular Universal (SSR), Prerendering, WebP.

---

## 💻 Comandos del Framework (Angular CLI)

* **Servidor de Desarrollo:** ```bash
    ng serve
    ```
* **Generación de Componentes:** ```bash
    ng generate component <nombre>
    ```
* **Compilación de Producción:** ```bash
    ng build
    ```
* **Pruebas Unitarias:** ```bash
    ng test
    ```