from django.contrib.auth.models import AbstractUser
from django.db import models

# Definir los roles personalizados
class Role(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return f"{self.name}"
