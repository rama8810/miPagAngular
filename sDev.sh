#!/bin/bash
# Ejecución: bash sync-full.sh "Tu mensaje de commit"

# 1. Descarga el news.json (y otros cambios) modificado por el workflow en remoto
git switch main
git pull origin main

# 2. Integra el archivo actualizado a tu entorno de trabajo
git switch develop
git merge main -m "Sync: Integra news.json automatico"