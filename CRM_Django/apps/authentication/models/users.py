from django.contrib.auth.models import AbstractUser,BaseUserManager,Permission,Group
from django.db import models
from .roles import Role

class User(AbstractUser):
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # Cambié el related_name aquí
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',  # Cambié el related_name aquí
        blank=True
    )
    
    def __str__(self):
        return f"{self.username}"
