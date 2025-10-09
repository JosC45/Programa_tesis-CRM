from rest_framework import viewsets
from apps.time.models.cycles import Cycle
from apps.time.serializers.cycle_serializer import CycleSerializer

class CycleViewSet(viewsets.ModelViewSet):
    queryset=Cycle.objects.all() # pylint: disable=no-member
    serializer_class=CycleSerializer