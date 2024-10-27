document.addEventListener('DOMContentLoaded', function () {
    // Funksjonen som parsar CSV-fila og teiknar grafen
    function drawChart(data) {
        console.log(data);
        // Klargjer data for Highcharts
        const temperatureData = data.map(row => [
            new Date(row[0]).getTime(),
            parseFloat(row[1])
        ]);

        // Teiknar grafen
        Highcharts.chart('container', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Temperaturendringar sidan starten'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Tid'
                }
            },
            yAxis: {
                title: {
                    text: 'Temperatur (°C)'
                }
            },
            series: [{
                name: 'Temperatur',
                data: temperatureData
            }]
        });
    }

    // Fetch and parse the CSV file
    Papa.parse('temperatur.csv', {
        download: true,
        header: false,
        complete: function (results) {
            drawChart(results.data);
        }
    });
});