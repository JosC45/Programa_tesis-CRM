from rest_framework import viewsets
from apps.services.models.services import Service
from apps.services.serializers.service_serializer import ServiceSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset=Service.objects.all() # pylint: disable=no-member
    serializer_class=ServiceSerializer