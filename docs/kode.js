// Hentar CSV-fila direkte frå repoet, slik at sida alltid viser siste data
const CSV_URL = 'https://raw.githubusercontent.com/hausnes/nordnes-sjobad/main/temperatur.csv';

const TIME = 3600 * 1000;
const DOGN = 24 * TIME;

document.addEventListener('DOMContentLoaded', function () {
    let graf = null;
    let valdeDagar = 30;

    Highcharts.setOptions({
        lang: {
            months: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli',
                'august', 'september', 'oktober', 'november', 'desember'],
            shortMonths: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul',
                'aug', 'sep', 'okt', 'nov', 'des'],
            weekdays: ['søndag', 'måndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag'],
            decimalPoint: ',',
            thousandsSep: ' ',
            resetZoom: 'Nullstill zoom'
        }
    });

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

    function formatTemp(verdi) {
        return Highcharts.numberFormat(verdi, 1) + ' °C';
    }

    // Finn sjømålinga som ligg nærast eit gitt tidspunkt (innanfor ein toleranse)
    function naerasteSjo(rader, tid, toleranse) {
        let best = null;
        for (const rad of rader) {
            if (rad.sjo === null) continue;
            const avstand = Math.abs(rad.tid - tid);
            if (avstand <= toleranse && (!best || avstand < Math.abs(best.tid - tid))) {
                best = rad;
            }
        }
        return best;
    }

    function visNokkeltal(rader) {
        const siste = [...rader].reverse().find(rad => rad.sjo !== null);
        if (!siste) {
            document.getElementById('siste').textContent = 'Fann ingen gyldige målingar.';
            return;
        }

        document.getElementById('sjo-nå').textContent = Highcharts.numberFormat(siste.sjo, 1);
        document.getElementById('siste').textContent =
            'Siste måling ' + Highcharts.dateFormat('%A %e. %B kl. %H:%M', siste.tid);

        document.getElementById('luft-nå').textContent =
            siste.luft !== null ? formatTemp(siste.luft) : '–';

        const gaarsdag = naerasteSjo(rader, siste.tid - DOGN, 3 * TIME);
        if (gaarsdag) {
            const diff = siste.sjo - gaarsdag.sjo;
            const element = document.getElementById('endring');
            const pil = diff > 0.05 ? '↑ ' : diff < -0.05 ? '↓ ' : '';
            element.textContent = pil + (diff > 0 ? '+' : '') + Highcharts.numberFormat(diff, 1) + ' °C';
            element.classList.toggle('opp', diff > 0.05);
            element.classList.toggle('ned', diff < -0.05);
        }

        const iFjor = naerasteSjo(rader, siste.tid - 365 * DOGN, 6 * TIME);
        if (iFjor) {
            document.getElementById('i-fjor').textContent = formatTemp(iFjor.sjo);
            document.getElementById('i-fjor-tekst').textContent =
                Highcharts.dateFormat('%e. %B %Y', iFjor.tid);
        }

        const aaret = new Date(siste.tid).getUTCFullYear();
        const varmast = rader
            .filter(rad => rad.sjo !== null && new Date(rad.tid).getUTCFullYear() === aaret)
            .reduce((best, rad) => (!best || rad.sjo > best.sjo ? rad : best), null);
        if (varmast) {
            document.getElementById('varmast').textContent = formatTemp(varmast.sjo);
            document.getElementById('varmast-tekst').textContent =
                Highcharts.dateFormat('%e. %B', varmast.tid);
        }
    }

    // Les fargar frå stilarket, slik at grafen følgjer lyst/mørkt tema
    function farge(namn) {
        return getComputedStyle(document.documentElement).getPropertyValue(namn).trim();
    }

    function settPeriode(dagar) {
        valdeDagar = dagar;
        document.querySelectorAll('.periodeval button').forEach(knapp => {
            knapp.setAttribute('aria-pressed', Number(knapp.dataset.dagar) === dagar);
        });
        if (!graf) return;
        const akse = graf.xAxis[0];
        const { dataMin, dataMax } = akse.getExtremes();
        akse.setExtremes(dagar ? Math.max(dataMin, dataMax - dagar * DOGN) : dataMin, dataMax);
    }

    function drawChart(rader) {
        const tekst = farge('--tekst');
        const dempa = farge('--dempa');
        const rutenett = farge('--rutenett');
        const sjo = farge('--sjo');

        graf = Highcharts.chart('container', {
            chart: {
                type: 'line',
                zooming: { type: 'x' },
                backgroundColor: 'transparent',
                style: { fontFamily: 'inherit' },
                spacing: [10, 0, 10, 0]
            },
            title: { text: null },
            credits: { enabled: false },
            legend: {
                align: 'left',
                verticalAlign: 'top',
                itemStyle: { color: tekst, fontWeight: '500' },
                itemHoverStyle: { color: dempa }
            },
            xAxis: {
                type: 'datetime',
                lineColor: rutenett,
                tickColor: rutenett,
                labels: { style: { color: dempa } },
                crosshair: { color: dempa, dashStyle: 'Dash', width: 1 }
            },
            yAxis: {
                title: { text: null },
                gridLineColor: rutenett,
                labels: {
                    format: '{value} °C',
                    style: { color: dempa }
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' °C',
                valueDecimals: 1,
                xDateFormat: '%e. %b %Y kl. %H:%M',
                backgroundColor: farge('--flate'),
                borderColor: farge('--kant'),
                borderRadius: 10,
                style: { color: tekst }
            },
            plotOptions: {
                series: {
                    lineWidth: 1.5,
                    marker: { enabled: false },
                    states: { hover: { lineWidthPlus: 0 } }
                }
            },
            series: [{
                name: 'Sjøtemperatur',
                type: 'area',
                color: sjo,
                lineWidth: 2,
                threshold: null,
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, Highcharts.color(sjo).setOpacity(0.3).get('rgba')],
                        [1, Highcharts.color(sjo).setOpacity(0).get('rgba')]
                    ]
                },
                data: rader.map(rad => [rad.tid, rad.sjo])
            }, {
                name: 'Lufttemperatur',
                color: farge('--luft'),
                data: rader.map(rad => [rad.tid, rad.luft])
            }]
        });
        settPeriode(valdeDagar);
    }

    document.querySelectorAll('.periodeval button').forEach(knapp => {
        knapp.addEventListener('click', () => settPeriode(Number(knapp.dataset.dagar)));
    });

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
            visNokkeltal(rader);
            drawChart(rader);

            // Teikn grafen på nytt med nye fargar om brukaren byter mellom lyst og mørkt tema
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', () => drawChart(rader));
        },
        error: function () {
            document.getElementById('siste').textContent =
                'Klarte ikkje å hente temperaturdata. Prøv igjen seinare.';
        }
    });
});
