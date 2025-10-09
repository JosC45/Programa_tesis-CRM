from rest_framework import viewsets
from apps.time.models.schedules import Schedule
from apps.time.serializers.schedule_serializer import ScheduleSerializer

class ScheduleViewSet(viewsets.ModelViewSet):
    queryset=Schedule.objects.all() # pylint: disable=no-member
    serializer_class=ScheduleSerializer