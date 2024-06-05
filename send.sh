#!/bin/bash
cd /home/hausnes/nordnes-sjobad/
git add temperatur.csv
git commit -m "Oppdatert temperatur: $(date)"
git push origin main