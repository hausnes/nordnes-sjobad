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
        temperature_outdoors = tree.xpath('/html/body/main/ul/li[4]/div/span[2]/text()')
        temperature_outdoors = temperature_outdoors[0].replace('°C', '')
        temperature_outdoors = temperature_outdoors.replace(',', '.')
        #print(temperature_outdoors)
        #print(type(temperature))
        return temperature, temperature_outdoors

    def save_to_csv(self, temperature, temperature_outdoors):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        with open('/home/hausnes/nordnes-sjobad/temperatur.csv', 'a', newline='') as file: # Endre sti til det du treng
            writer = csv.writer(file, lineterminator=os.linesep)
            writer.writerow([timestamp, temperature, temperature_outdoors])

fetcher = TemperatureFetcher('https://nordnessjobad.no/sanntid/')
temperature, temperature_outdoors = fetcher.fetch_temperature()
#print(temperature, temperature_outdoors)
fetcher.save_to_csv(temperature, temperature_outdoors)