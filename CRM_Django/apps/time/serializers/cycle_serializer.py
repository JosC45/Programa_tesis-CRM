from rest_framework import serializers
from apps.time.models.cycles import Cycle

class CycleSerializer(serializers.ModelSerializer):
    class Meta:
        model= Cycle
        fields= '__all__'