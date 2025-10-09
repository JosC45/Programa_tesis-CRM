from rest_framework import viewsets
from apps.time.models.days import Day
from apps.time.serializers.day_serializer import DaySerializer

class DayViewSet(viewsets.ModelViewSet):
    queryset=Day.objects.all() # pylint: disable=no-member
    serializer_class=DaySerializer