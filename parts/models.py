"""
ChatGPT4.0 mini prompt:

Can you help me write DJango models to represent parts in an inventory system?

Each part will have a part number, name, location, quantity, and status.

Part numbers are not unique, so the model should also create a unique ID.

Location is a foreign key; each entry in the Location model will be represented by a string (eg. "Engine Room", "Shelf A", "Shelf B".
Status is a foreign key; each entry in the Status model will be represented by a string (eg. "Servicable", "Overhauled", "New").

The Name field is a string. The Quantity field is an integer.

"""
from django.db import models

class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Status(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "statuses"

    def __str__(self):
        return self.name

class Part(models.Model):
    part_number = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    status = models.ForeignKey(Status, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.part_number} - {self.name} ({self.quantity})"
