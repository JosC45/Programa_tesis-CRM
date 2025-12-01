from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q

from .models import (
    Docente, Psicologo, Alumno, Ciclo, NombreTaller, Servicio, 
    Taller, Psicopedagogia, Encuesta, Pregunta, Horario, DiaSemana,
    TallerDocente, TallerAlumno, TallerHorario, RespuestaEncuesta, ServicioCiclo
)
from .serializers import *

class DocenteViewSet(viewsets.ModelViewSet):
    queryset = Docente.objects.all()
    serializer_class = DocenteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Docente.objects.all()
        return Docente.objects.none()

class PsicologoViewSet(viewsets.ModelViewSet):
    queryset = Psicologo.objects.all()
    serializer_class = PsicologoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Psicologo.objects.all()
        return Psicologo.objects.none()

class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Alumno.objects.all()
        # Los alumnos solo pueden ver su propio perfil
        return Alumno.objects.filter(user=self.request.user)

class CicloViewSet(viewsets.ModelViewSet):
    queryset = Ciclo.objects.all()
    serializer_class = CicloSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.groups.filter(name='Gestor').exists():
            return Ciclo.objects.all()
        # Los alumnos solo pueden ver los ciclos activos
        return Ciclo.objects.filter(activo=True)

class NombreTallerViewSet(viewsets.ModelViewSet):
    queryset = NombreTaller.objects.all()
    serializer_class = NombreTallerSerializer
    permission_classes = [IsAuthenticated]

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.groups.filter(name='Gestor').exists():
            return Servicio.objects.all()
        # Los alumnos solo pueden ver los servicios activos
        return Servicio.objects.filter(activo=True)

class TallerViewSet(viewsets.ModelViewSet):
    queryset = Taller.objects.all()
    serializer_class = TallerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Taller.objects.all()
        
        # Filtros comunes
        ciclo = self.request.query_params.get('ciclo', None)
        if ciclo:
            queryset = queryset.filter(ciclo_id=ciclo)
            
        servicio = self.request.query_params.get('servicio', None)
        if servicio:
            queryset = queryset.filter(servicio_id=servicio)
        
        # Filtros por rol
        if user.is_staff or user.groups.filter(name='Gestor').exists():
            return queryset
        elif user.groups.filter(name='Docente').exists():
            # Docentes ven solo los talleres que imparten
            return queryset.filter(docentes_asignados__docente__user=user)
        else:
            # Alumnos ven solo talleres activos
            return queryset.filter(activo=True)
    
    @action(detail=True, methods=['post'])
    def inscribir_alumno(self, request, pk=None):
        """Inscribe a un alumno en el taller"""
        if not request.user.groups.filter(name='Alumno').exists():
            return Response(
                {"error": "Solo los alumnos pueden inscribirse en talleres"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            alumno = Alumno.objects.get(user=request.user)
            taller = self.get_object()
            
            # Verificar si hay cupos disponibles
            if taller.cupos_disponibles <= 0:
                return Response(
                    {"error": "No hay cupos disponibles en este taller"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Verificar si el alumno ya está inscrito
            if TallerAlumno.objects.filter(taller=taller, alumno=alumno).exists():
                return Response(
                    {"error": "Ya estás inscrito en este taller"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Inscribir al alumno
            inscripcion = TallerAlumno.objects.create(
                taller=taller,
                alumno=alumno,
                estado='inscrito'
            )
            
            # Actualizar cupos disponibles
            taller.cupos_disponibles -= 1
            taller.save()
            
            return Response(
                {"message": "Inscripción exitosa"},
                status=status.HTTP_201_CREATED
            )
            
        except Alumno.DoesNotExist:
            return Response(
                {"error": "Perfil de alumno no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PsicopedagogiaViewSet(viewsets.ModelViewSet):
    queryset = Psicopedagogia.objects.all()
    serializer_class = PsicopedagogiaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Psicopedagogia.objects.all()
        
        # Filtros por rol
        if user.is_staff or user.groups.filter(name='Gestor').exists():
            return queryset
        elif user.groups.filter(name='Psicologo').exists():
            # Psicólogos ven solo sus propias sesiones
            return queryset.filter(psicologo__user=user)
        else:
            # Alumnos ven solo sus propias sesiones
            return queryset.filter(alumno__user=user)

class EncuestaViewSet(viewsets.ModelViewSet):
    queryset = Encuesta.objects.all()
    serializer_class = EncuestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Encuesta.objects.all()
        
        # Filtros por rol
        if user.is_staff or user.groups.filter(name='Gestor').exists():
            return queryset
        else:
            # Alumnos ven solo encuestas activas
            return queryset.filter(activa=True)

class PreguntaViewSet(viewsets.ModelViewSet):
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [IsAuthenticated]

class DiaSemanaViewSet(viewsets.ModelViewSet):
    queryset = DiaSemana.objects.all()
    serializer_class = DiaSemanaSerializer
    permission_classes = [IsAuthenticated]

class TallerDocenteViewSet(viewsets.ModelViewSet):
    queryset = TallerDocente.objects.all()
    serializer_class = TallerDocenteSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

class TallerAlumnoViewSet(viewsets.ModelViewSet):
    queryset = TallerAlumno.objects.all()
    serializer_class = TallerAlumnoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = TallerAlumno.objects.all()
        
        # Filtros por rol
        if user.is_staff or user.groups.filter(name='Gestor').exists():
            return queryset
        elif user.groups.filter(name='Docente').exists():
            # Docentes ven solo los alumnos de sus talleres
            return queryset.filter(taller__docentes_asignados__docente__user=user)
        else:
            # Alumnos ven solo sus propias inscripciones
            return queryset.filter(alumno__user=user)

class TallerHorarioViewSet(viewsets.ModelViewSet):
    queryset = TallerHorario.objects.all()
    serializer_class = TallerHorarioSerializer
    permission_classes = [IsAuthenticated]

class RespuestaEncuestaViewSet(viewsets.ModelViewSet):
    queryset = RespuestaEncuesta.objects.all()
    serializer_class = RespuestaEncuestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = RespuestaEncuesta.objects.all()
        
        # Filtros por rol
        if user.is_staff or user.groups.filter(name='Gestor').exists():
            return queryset
        else:
            # Usuarios solo pueden ver sus propias respuestas
            return queryset.filter(alumno__user=user)

class ServicioCicloViewSet(viewsets.ModelViewSet):
    queryset = ServicioCiclo.objects.all()
    serializer_class = ServicioCicloSerializer
    permission_classes = [IsAuthenticated]
