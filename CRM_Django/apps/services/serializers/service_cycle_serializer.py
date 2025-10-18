from rest_framework import serializers
from ..models.services_cycle import ServicesCycle
from ..models.services import Service
from ...time.models.cycles import Cycle

class ServiceCycleSerializer(serializers.ModelSerializer):
    service=serializers.PrimaryKeyRelatedField(queryset=Service.objects.all()) # pylint: disable=no-member
    cycle=serializers.PrimaryKeyRelatedField(queryset=Cycle.objects.all()) # pylint: disable=no-member

    class Meta:
        model=ServicesCycle
        fields="__all__"

