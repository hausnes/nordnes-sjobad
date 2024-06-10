# Badetemperaturar frå Nordnes sjøbad
Hentar hav- og lufttemperatur frå Nordnes sjøbad si offisielle nettside og lagrar desse i ei CSV-fil. Data blir oppdatert kvar time.

# Oppdateringar
- Feil: 28. mai: Nettsida viser ikkje temperaturar for øyeblikket, så data i CSV-fila blir berre i form av teiknet "-". Dette er ikkje noko eg kan gjere noko med.

# Om koden
- Python-koden køyrer på ein Ubuntu-server vha. crontab (frå terminal: crontab -e)
- Hentar data kvar time, og skriv dette til lokal CSV-fil: [crontab.guru](https://crontab.guru/#*_*_*_*_*)
- Overfører oppdatert CSV-fil til Github 1 minutt seinare vha. send.sh: [crontab.guru](https://crontab.guru/#1_*_*_*_*)

# Tips til seinare
- Setje opp SSH for autentisering: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Om Git insisterer på å nytta brukarnamn og passord fordi du clona prosjektet vha. https: https://github.com/orgs/community/discussions/23171
- Laste opp filer via CLI: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Køyre sh-fil: chmod +x send.sh og deretter /full/sti/send.sh i crontab.
