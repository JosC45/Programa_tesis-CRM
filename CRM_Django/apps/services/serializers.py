from rest_framework import serializers
from .models import (
    Docente, Psicologo, Alumno, Ciclo, NombreTaller, Servicio, 
    Taller, Psicopedagogia, Encuesta, Pregunta, Horario, DiaSemana,
    TallerDocente, TallerAlumno, TallerHorario, RespuestaEncuesta, ServicioCiclo
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente._meta.get_field('user').related_model
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class DocenteSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Docente
        fields = '__all__'

class PsicologoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Psicologo
        fields = '__all__'

class AlumnoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Alumno
        fields = '__all__'

class CicloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciclo
        fields = '__all__'

class NombreTallerSerializer(serializers.ModelSerializer):
    class Meta:
        model = NombreTaller
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class TallerSerializer(serializers.ModelSerializer):
    nombre_taller = NombreTallerSerializer()
    servicio = ServicioSerializer()
    ciclo = CicloSerializer()
    
    class Meta:
        model = Taller
        fields = '__all__'

class PsicopedagogiaSerializer(serializers.ModelSerializer):
    alumno = AlumnoSerializer()
    psicologo = PsicologoSerializer()
    
    class Meta:
        model = Psicopedagogia
        fields = '__all__'

class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = '__all__'

class EncuestaSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Encuesta
        fields = '__all__'

class DiaSemanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaSemana
        fields = '__all__'

class HorarioSerializer(serializers.ModelSerializer):
    dia_semana = DiaSemanaSerializer()
    
    class Meta:
        model = Horario
        fields = '__all__'

class TallerDocenteSerializer(serializers.ModelSerializer):
    taller = TallerSerializer()
    docente = DocenteSerializer()
    
    class Meta:
        model = TallerDocente
        fields = '__all__'

class TallerAlumnoSerializer(serializers.ModelSerializer):
    taller = TallerSerializer()
    alumno = AlumnoSerializer()
    
    class Meta:
        model = TallerAlumno
        fields = '__all__'

class TallerHorarioSerializer(serializers.ModelSerializer):
    taller = TallerSerializer()
    horario = HorarioSerializer()
    
    class Meta:
        model = TallerHorario
        fields = '__all__'

class RespuestaEncuestaSerializer(serializers.ModelSerializer):
    alumno = AlumnoSerializer()
    pregunta = PreguntaSerializer()
    
    class Meta:
        model = RespuestaEncuesta
        fields = '__all__'

class ServicioCicloSerializer(serializers.ModelSerializer):
    servicio = ServicioSerializer()
    ciclo = CicloSerializer()
    
    class Meta:
        model = ServicioCiclo
        fields = '__all__'
