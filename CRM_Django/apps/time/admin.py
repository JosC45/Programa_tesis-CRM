from django.contrib import admin
from apps.time.models.cycles import Cycle
from apps.time.models.days import Day
from apps.time.models.schedules import Schedule

# Register your models here.

admin.site.register(Cycle)
admin.site.register(Day)
admin.site.register(Schedule)