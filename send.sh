#!/bin/bash
# Pushar til data-greina med eigen bot-identitet, slik at main og kontribusjonsgrafen held seg reine
cd /home/hausnes/nordnes-sjobad/
git checkout -q data || exit 1
git add temperatur.csv
git -c user.name="temperatur-bot" -c user.email="temperatur-bot@users.noreply.github.com" commit -m "Oppdatert temperatur: $(date)"
git push origin data
