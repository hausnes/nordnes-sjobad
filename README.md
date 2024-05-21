# Badetemperaturar frå Nordnes sjøbad
Hentar temperatur frå Nordnes sjøbad si offisielle nettside og lagrar temperaturen i ei CSV-fil. Data blir oppdatert kvar time.

# Om koden
- Køyrer på ein Ubuntu-server vha. crontab.
- Hentar data kvar time, og skriv dette til lokal CSV-fil (https://crontab.guru/#*_*_*_*_*)
- Overfører oppdatert CSV-fil til Github 1 minutt seinare (https://crontab.guru/#1_*_*_*_*)

# Tips til seinare
- Setje opp SSH for autentisering: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Om Git insisterer på å nytta brukarnamn og passord: https://github.com/orgs/community/discussions/23171
- Laste opp filer via CLI: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository