from ...shared.models.base import BaseModel
from django.db import models
from .services import Service
from ...time.models.cycles import Cycle

class ServicesCycle(BaseModel):
    
    service=models.ForeignKey(Service,on_delete=models.CASCADE)
    cycle=models.ForeignKey(Cycle,on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.service}-{self.cycle}"
    