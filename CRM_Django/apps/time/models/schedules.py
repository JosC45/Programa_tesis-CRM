from rest_framework.exceptions import ValidationError
from ...shared.models.base import BaseModel
from django.db import models
from apps.time.models.days import Day

class Schedule(models.Model):
    day=models.ForeignKey(Day, on_delete=models.CASCADE)
    start_time=models.TimeField()
    end_time=models.TimeField()
    
    def clean(self):
        if self.start_time>=self.end_time:
            raise ValidationError("The end time must be after the start time")
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args,**kwargs)
    