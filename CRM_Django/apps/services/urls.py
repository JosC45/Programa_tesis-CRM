from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views.service_view import ServiceViewSet
from .views.services_cycle_view import ServiceCycleViewSet

router=DefaultRouter()
router.register(r'services',ServiceViewSet)
router.register(r'servicesCycle',ServiceCycleViewSet)

urlpatterns=[
    path('',include(router.urls))
]
