from django.contrib import admin
from .models import (
    Docente, Psicologo, Alumno, Ciclo, NombreTaller, Servicio,
    Taller, Psicopedagogia, Encuesta, Pregunta, Horario, DiaSemana,
    TallerDocente, TallerAlumno, TallerHorario, RespuestaEncuesta, ServicioCiclo
)

@admin.register(Docente)
class DocenteAdmin(admin.ModelAdmin):
    list_display = ('user', 'rut', 'telefono')
    search_fields = ('user__username', 'rut')

@admin.register(Psicologo)
class PsicologoAdmin(admin.ModelAdmin):
    list_display = ('user', 'rut', 'especialidad')
    search_fields = ('user__username', 'rut')

@admin.register(Alumno)
class AlumnoAdmin(admin.ModelAdmin):
    list_display = ('user', 'rut', 'carrera', 'año_ingreso')
    search_fields = ('user__username', 'rut', 'carrera')

@admin.register(Ciclo)
class CicloAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha_inicio', 'fecha_fin', 'activo')
    list_filter = ('activo',)
    search_fields = ('nombre',)

@admin.register(NombreTaller)
class NombreTallerAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo', 'activo')
    list_filter = ('tipo', 'activo')
    search_fields = ('nombre',)

@admin.register(Taller)
class TallerAdmin(admin.ModelAdmin):
    list_display = ('nombre_taller', 'servicio', 'ciclo', 'cupos', 'cupos_disponibles', 'activo')
    list_filter = ('servicio', 'ciclo', 'activo')
    search_fields = ('nombre_taller__nombre',)
    filter_horizontal = ('docentes_asignados',)

@admin.register(Psicopedagogia)
class PsicopedagogiaAdmin(admin.ModelAdmin):
    list_display = ('alumno', 'psicologo', 'fecha', 'hora_inicio', 'hora_fin', 'estado')
    list_filter = ('estado', 'fecha')
    search_fields = ('alumno__user__username', 'psicologo__user__username')

@admin.register(Encuesta)
class EncuestaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'servicio', 'activa')
    list_filter = ('activa', 'servicio')
    search_fields = ('titulo',)

@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ('texto', 'tipo', 'obligatoria', 'orden', 'encuesta')
    list_filter = ('tipo', 'obligatoria')
    search_fields = ('texto',)

@admin.register(Horario)
class HorarioAdmin(admin.ModelAdmin):
    list_display = ('hora_inicio', 'hora_fin', 'dia_semana')
    list_filter = ('dia_semana',)

@admin.register(DiaSemana)
class DiaSemanaAdmin(admin.ModelAdmin):
    list_display = ('get_nombre_display',)

@admin.register(TallerDocente)
class TallerDocenteAdmin(admin.ModelAdmin):
    list_display = ('taller', 'docente')
    search_fields = ('taller__nombre_taller__nombre', 'docente__user__username')

@admin.register(TallerAlumno)
class TallerAlumnoAdmin(admin.ModelAdmin):
    list_display = ('taller', 'alumno', 'estado', 'calificacion')
    list_filter = ('estado',)
    search_fields = ('taller__nombre_taller__nombre', 'alumno__user__username')

@admin.register(TallerHorario)
class TallerHorarioAdmin(admin.ModelAdmin):
    list_display = ('taller', 'horario')

@admin.register(RespuestaEncuesta)
class RespuestaEncuestaAdmin(admin.ModelAdmin):
    list_display = ('alumno', 'pregunta')
    search_fields = ('alumno__user__username', 'pregunta__texto')

@admin.register(ServicioCiclo)
class ServicioCicloAdmin(admin.ModelAdmin):
    list_display = ('servicio', 'ciclo', 'activo')
    list_filter = ('activo', 'ciclo')
    search_fields = ('servicio__nombre', 'ciclo__nombre')
