from rest_framework import serializers
from apps.time.models.days import Day

class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model= Day
        fields= ('id','name')