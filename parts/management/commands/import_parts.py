import json
from django.core.management.base import BaseCommand
from parts.models import Part, Location, Status  # Adjust the import based on your app name

class Command(BaseCommand):
    help = 'Import parts from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='The path to the JSON file containing parts data')

    def handle(self, *args, **kwargs):
        json_file = kwargs['json_file']

        with open(json_file, 'r') as file:
            data = json.load(file)

        parts = data.get("acs-inventory-parts", [])

        for part_data in parts:
            item = part_data["PutRequest"]["Item"]
            part_number = item["partNumber"]["S"]
            name = item["name"]["S"]
            location_name = item["location"]["S"]
            quantity = int(item["quantity"]["N"])
            status_name = item["status"]["S"]

            # Get or create the location
            location, created = Location.objects.get_or_create(name=location_name)

            # Get or create the status
            status, created = Status.objects.get_or_create(name=status_name)

            # Create the Part instance
            part = Part(
                part_number=part_number,
                name=name,
                location=location,
                quantity=quantity,
                status=status
            )
            part.save()

        self.stdout.write(self.style.SUCCESS('Successfully imported parts'))
