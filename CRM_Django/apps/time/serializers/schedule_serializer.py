from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from apps.time.models.days import Day
from apps.time.models.schedules import Schedule

class ScheduleSerializer(serializers.ModelSerializer):
    day=serializers.PrimaryKeyRelatedField(queryset=Day.objects.all())  # pylint: disable=no-member

    class Meta:
        model=Schedule
        fields=('id','start_time','end_time','day')

    def validate(self,data):
        if data['start_time']>=data['end_time']:
            raise ValidationError("The end time must be after than the start time")
        return data

