# Badetemperaturar frå Nordnes sjøbad
Dei offisielle sidene til Nordnes Sjøbad viser live-data frå temperaturmålingane som vert gjort der. I eit av faga eg underviser i hadde me derimot behov for å kunne sjå og vurdere historiske data, og det var derfor denne koden blei skriven.

Kort oppsummert så hentar temperatur.py hav- og lufttemperatur frå Nordnes sjøbad si offisielle nettside, og lagrar desse i ei CSV-fil. Data blir oppdatert kvar time. 

Første datapunkt er frå 21. mai 2024, og fortset til det eventuelt blir laga noko offisielt frå Nordnes sjøbad si side.

# Oppdateringar
- Feil på Nordnes sjøbad sine tjenestar: Nettsida viser ikkje temperaturar for øyeblikket, så data i CSV-fila blir berre i form av teiknet "-". Dette er ikkje noko eg kan gjere noko med. Koden som tolkar data er ellers oppdatert for å kunne handtere slike feil.
  - ‎ 28. mai, 2024
  - ‎ 11. juni, 2024
- Alternativ versjon, 10. juni: Merga Node JS-app frå as-troska (Trond), som lar deg køyre heile greiene på eigen server. Du kan sjå nettsida hans for ein aktiv versjon av denne appen: https://nordnes.sneaas.no/. Oppdaterte filer:
  - app.js (for å starte server)
  - public-mappa med index.html (web-visning)
  - package.json for å sjå kva pakkar som er naudsynte (installer ved oppstart: npm install)

# Om koden
- Python-koden køyrer på ein Ubuntu-server vha. crontab (frå terminal: crontab -e)
- Hentar data kvar time, og skriv dette til lokal CSV-fil: [crontab.guru](https://crontab.guru/#0_*_*_*_*)
- Overfører oppdatert CSV-fil til Github 1 minutt seinare vha. send.sh: [crontab.guru](https://crontab.guru/#1_*_*_*_*)

# Tips til seinare
- Setje opp SSH for autentisering: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Om Git insisterer på å nytta brukarnamn og passord fordi du clona prosjektet vha. https: https://github.com/orgs/community/discussions/23171
- Laste opp filer via CLI: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Køyre sh-fil: chmod +x send.sh og deretter /full/sti/send.sh i crontab.
