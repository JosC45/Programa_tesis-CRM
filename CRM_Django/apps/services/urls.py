from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DocenteViewSet, PsicologoViewSet, AlumnoViewSet, CicloViewSet, 
    NombreTallerViewSet, ServicioViewSet, TallerViewSet, PsicopedagogiaViewSet,
    EncuestaViewSet, PreguntaViewSet, HorarioViewSet, DiaSemanaViewSet,
    TallerDocenteViewSet, TallerAlumnoViewSet, TallerHorarioViewSet, 
    RespuestaEncuestaViewSet, ServicioCicloViewSet
)

router = DefaultRouter()
router.register(r'docentes', DocenteViewSet)
router.register(r'psicologos', PsicologoViewSet)
router.register(r'alumnos', AlumnoViewSet)
router.register(r'ciclos', CicloViewSet)
router.register(r'nombres-taller', NombreTallerViewSet)
router.register(r'servicios', ServicioViewSet)
router.register(r'talleres', TallerViewSet)
router.register(r'psicopedagogias', PsicopedagogiaViewSet)
router.register(r'encuestas', EncuestaViewSet)
router.register(r'preguntas', PreguntaViewSet)
router.register(r'horarios', HorarioViewSet)
router.register(r'dias-semana', DiaSemanaViewSet)
router.register(r'talleres-docentes', TallerDocenteViewSet)
router.register(r'talleres-alumnos', TallerAlumnoViewSet)
router.register(r'talleres-horarios', TallerHorarioViewSet)
router.register(r'respuestas-encuesta', RespuestaEncuestaViewSet)
router.register(r'servicios-ciclo', ServicioCicloViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
