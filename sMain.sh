#!/bin/bash
# Ejecución: bash sync-dev.sh "Tu mensaje de commit"

# 1. Agregar y comprometer cambios
git add .
git commit -m "$1"

# 2. Sincronización (Equivalente al botón Sync de VS Code: Pull + Push)
git pull origin develop
git push origin develop

# 3. Fusión con la rama de producción
git switch main
git merge develop -m "$1"
git push origin main

# 4. Retorno al entorno de trabajo
git switch develop