from django.urls import path,include
from rest_framework.routers import DefaultRouter
from apps.time.views.day_view import DayViewSet
from apps.time.views.schedule_view import ScheduleViewSet
from apps.time.views.cycle_view import CycleViewSet


router=DefaultRouter()
router.register(r'days',DayViewSet)
router.register(r'schedules',ScheduleViewSet)
router.register(r'cycles',CycleViewSet)

urlpatterns=[
    path('',include(router.urls))
]
