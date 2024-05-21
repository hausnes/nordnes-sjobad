const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const { exec } = require('child_process');
const { finished } = require('stream/promises');
const path = require('path');


const cors = require('cors');


const app = express();

app.use(express.static(path.join(__dirname, 'public')));

function runPythonScript() {
    exec('python3 temperatur.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

runPythonScript();

setInterval(runPythonScript, 3600000);




async function latestTempAsJson() {
    const results = [];
    let latest = {};
    const stream = fs.createReadStream('temperatur.csv');
    const csvStream = stream.pipe(csv());

    csvStream.on('data', (data) => {
        results.push(data);
    });

    await finished(csvStream);

    console.log(results);

    latest.time = results[results.length - 1].Temperature;
    latest.temperature = results[results.length - 1]._1;

    return latest;
}

async function fileAsJson() {
    const results = [];
    const stream = fs.createReadStream('temperatur.csv');
    const csvStream = stream.pipe(csv());

    csvStream.on('data', (data) => {
        results.push({
            time: data.Temperature,
            temperature: data._1
        });
    });

    await finished(csvStream);

    return results;
}


app.get('/latest', async (req, res) => {
    const latest = await latestTempAsJson();
    res.json(latest);
});

app.get('/all', async (req, res) => {
    const all = await fileAsJson();
    res.json(all);
});

app.listen(1905, () => {
    console.log('Server is running on port 1905');
});






