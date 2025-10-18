from rest_framework import serializers
from ..models.services import Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Service
        fields=("id","name")