// Hentar CSV-fila direkte frå repoet, slik at sida alltid viser siste data
const CSV_URL = 'https://raw.githubusercontent.com/hausnes/nordnes-sjobad/main/temperatur.csv';

document.addEventListener('DOMContentLoaded', function () {
    // Gjer om "2024-05-21 13:29:27" til eit tidsstempel. Brukar Date.UTC slik at
    // klokkeslettet blir vist akkurat slik det står i fila, uavhengig av nettlesar.
    function parseTid(tekst) {
        const [dato, klokke] = tekst.split(' ');
        const [aar, maanad, dag] = dato.split('-').map(Number);
        const [time, minutt, sekund] = klokke.split(':').map(Number);
        return Date.UTC(aar, maanad - 1, dag, time, minutt, sekund);
    }

    // Ugyldige målingar ("-", "NaN" o.l.) blir null, som gir hol i grafen.
    // Sensoren rapporterer av og til -50 ved feil, så verdiar under minimum blir òg forkasta.
    function parseTemp(tekst, minimum) {
        const verdi = parseFloat(tekst);
        return Number.isFinite(verdi) && verdi >= minimum ? verdi : null;
    }

    function visSisteMaaling(rader) {
        const siste = [...rader].reverse().find(rad => rad.sjo !== null);
        if (!siste) return;
        const tid = Highcharts.dateFormat('%e. %b %Y kl. %H:%M', siste.tid);
        let tekst = `Siste måling (${tid}): <strong>${siste.sjo} °C</strong> i sjøen`;
        if (siste.luft !== null) {
            tekst += `, ${siste.luft} °C i lufta`;
        }
        document.getElementById('siste').innerHTML = tekst + '.';
    }

    function drawChart(rader) {
        Highcharts.chart('container', {
            chart: {
                type: 'line',
                zooming: { type: 'x' }
            },
            title: {
                text: 'Temperaturendringar sidan starten'
            },
            subtitle: {
                text: 'Dra over eit område i grafen for å zoome inn'
            },
            xAxis: {
                type: 'datetime',
                title: { text: 'Tid' }
            },
            yAxis: {
                title: { text: 'Temperatur (°C)' }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' °C',
                xDateFormat: '%e. %b %Y kl. %H:%M'
            },
            series: [{
                name: 'Sjøtemperatur',
                data: rader.map(rad => [rad.tid, rad.sjo])
            }, {
                name: 'Lufttemperatur',
                data: rader.map(rad => [rad.tid, rad.luft])
            }]
        });
    }

    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const rader = results.data
                .filter(rad => rad.tid)
                .map(rad => ({
                    tid: parseTid(rad.tid),
                    sjo: parseTemp(rad.temperatur, -3),
                    luft: parseTemp(rad.lufttemperatur, -40)
                }));
            visSisteMaaling(rader);
            drawChart(rader);
        },
        error: function () {
            document.getElementById('siste').textContent =
                'Klarte ikkje å hente temperaturdata. Prøv igjen seinare.';
        }
    });
});
