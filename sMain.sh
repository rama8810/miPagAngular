#!/bin/bash
# Ejecución: bash sync-dev.sh "Tu mensaje de commit"

# 1. Agregar y comprometer cambios
git add .
git commit -m "$1"

# 2. Sincronizar y Desplegar a Producción (Main es la fuente de la verdad)
echo "🔄 Sincronizando con origin/main..."
git pull origin main --rebase

# 3. Sube la rama local actual (develop) directamente a la rama de producción (main) en el remoto
echo "🚀 Desplegando a producción (main)..."
git push origin HEAD:main

echo "✅ Código en producción y entorno local actualizado."
