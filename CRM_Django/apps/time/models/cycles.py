from django.db import models

class Cycle(models.Model):
    name=models.CharField(max_length=25)
    year=models.IntegerField()
    number=models.CharField(max_length=10)

    def __str__(self):
        return f"{self.name}"