from lxml import html
import requests
import csv
from datetime import datetime
import os

class TemperatureFetcher:
    def __init__(self, url):
        self.url = url

    def fetch_temperature(self):
        response = requests.get(self.url)
        content = response.content.decode('utf-8')
        tree = html.fromstring(content)
        temperature = tree.xpath('/html/body/main/ul/li[6]/div/span[2]/text()')
        temperature = temperature[0].replace('°C', '')
        temperature = temperature.replace(',', '.')
        #print(temperature)
        #print(type(temperature))
        return temperature

    def save_to_csv(self, temperature):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open('temperatur.csv', 'a', newline='') as file:
            writer = csv.writer(file, lineterminator=os.linesep)
            writer.writerow([timestamp, temperature])

fetcher = TemperatureFetcher('https://nordnessjobad.no/sanntid/')
temperature = fetcher.fetch_temperature()
fetcher.save_to_csv(temperature)