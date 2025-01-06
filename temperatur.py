from lxml import html
import requests
import csv
from datetime import datetime
from zoneinfo import ZoneInfo
import os
import sys


class TemperatureFetcher:
    def __init__(
        self,
        url: str = "https://nordnessjobad.no/sanntid/",
        output: str = os.path.join(os.path.dirname(__file__), "temperatur.csv"),
    ):
        self.url = url
        self.output = output

    def parse_temperature(self, input_temperature: str) -> str:
        temperature = input_temperature.replace(",", ".").replace("°C", "").strip()
        try:
            float(temperature)
            return temperature
        except ValueError:
            return "-"

    def fetch_temperature(self) -> tuple[str, str]:
        response = requests.get(self.url)
        content = response.content.decode("utf-8")
        tree = html.fromstring(content)
        temp = tree.xpath("/html/body/main/ul/li[6]/div/span[2]/text()")[0]
        temp_outdoors = tree.xpath("/html/body/main/ul/li[4]/div/span[2]/text()")[0]
        return self.parse_temperature(temp), self.parse_temperature(temp_outdoors)

    def save_to_csv(self, temperature: str, temperature_outdoors: str) -> None:
        timestamp = datetime.now(ZoneInfo("Europe/Oslo")).strftime("%Y-%m-%d %H:%M:%S")
        with open(
            os.path.join(os.path.dirname(__file__), "temperatur.csv"), "a", newline=""
        ) as file:
            writer = csv.writer(file, lineterminator=os.linesep)
            writer.writerow([timestamp, temperature, temperature_outdoors])


if __name__ == "__main__":
    fetcher = TemperatureFetcher()
    temperature, temperature_outdoors = fetcher.fetch_temperature()
    if "--test" in sys.argv:
        print(f"{temperature}, {temperature_outdoors}")
    else:
        fetcher.save_to_csv(temperature, temperature_outdoors)
