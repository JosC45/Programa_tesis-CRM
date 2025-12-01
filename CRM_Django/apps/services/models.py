from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Docente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='docente_profile')
    rut = models.CharField(max_length=12, unique=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}"

class Psicologo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='psicologo_profile')
    rut = models.CharField(max_length=12, unique=True)
    especialidad = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}"

class Alumno(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='alumno_profile')
    rut = models.CharField(max_length=12, unique=True)
    carrera = models.CharField(max_length=100)
    año_ingreso = models.IntegerField()
    telefono = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}"

class Ciclo(models.Model):
    nombre = models.CharField(max_length=100)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

class NombreTaller(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

class Servicio(models.Model):
    TIPO_SERVICIO = [
        ('taller', 'Taller'),
        ('psicopedagogia', 'Psicopedagogía'),
        ('otro', 'Otro')
    ]
    
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_SERVICIO)
    activo = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='servicios_creados')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

class Taller(models.Model):
    nombre_taller = models.ForeignKey(NombreTaller, on_delete=models.CASCADE)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='talleres')
    ciclo = models.ForeignKey(Ciclo, on_delete=models.CASCADE, related_name='talleres')
    cupos = models.PositiveIntegerField()
    cupos_disponibles = models.PositiveIntegerField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    activo = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='talleres_creados')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre_taller.nombre} - {self.ciclo.nombre}"

class Psicopedagogia(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada')
    ]
    
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='psicopedagogias')
    psicologo = models.ForeignKey(Psicologo, on_delete=models.SET_NULL, null=True, related_name='sesiones')
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    observaciones = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.alumno} - {self.fecha}"

class Encuesta(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='encuestas')
    activa = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='encuestas_creadas')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo

class Pregunta(models.Model):
    TIPO_RESPUESTA = [
        ('texto', 'Texto abierto'),
        ('opcion_multiple', 'Opción múltiple'),
        ('escala', 'Escala')
    ]
    
    encuesta = models.ForeignKey(Encuesta, on_delete=models.CASCADE, related_name='preguntas')
    texto = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_RESPUESTA)
    opciones = models.JSONField(blank=True, null=True)  # Para opciones de opción múltiple
    obligatoria = models.BooleanField(default=True)
    orden = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.texto[:50] + '...' if len(self.texto) > 50 else self.texto

class DiaSemana(models.Model):
    DIAS = [
        (1, 'Lunes'),
        (2, 'Martes'),
        (3, 'Miércoles'),
        (4, 'Jueves'),
        (5, 'Viernes'),
        (6, 'Sábado'),
        (7, 'Domingo'),
    ]
    
    nombre = models.PositiveSmallIntegerField(choices=DIAS, unique=True)

    def __str__(self):
        return self.get_nombre_display()

class Horario(models.Model):
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    dia_semana = models.ForeignKey(DiaSemana, on_delete=models.CASCADE, related_name='horarios')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('hora_inicio', 'hora_fin', 'dia_semana')

    def __str__(self):
        return f"{self.get_dia_semana_display()} - {self.hora_inicio} a {self.hora_fin}"

# Modelos de relación muchos a muchos
class TallerDocente(models.Model):
    taller = models.ForeignKey(Taller, on_delete=models.CASCADE, related_name='docentes_asignados')
    docente = models.ForeignKey(Docente, on_delete=models.CASCADE, related_name='talleres_asignados')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('taller', 'docente')

class TallerAlumno(models.Model):
    ESTADO_CHOICES = [
        ('inscrito', 'Inscrito'),
        ('aprobado', 'Aprobado'),
        ('reprobado', 'Reprobado'),
        ('retirado', 'Retirado')
    ]
    
    taller = models.ForeignKey(Taller, on_delete=models.CASCADE, related_name='alumnos_inscritos')
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='talleres_inscritos')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='inscrito')
    calificacion = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    asistencia = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # Porcentaje de asistencia
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('taller', 'alumno')

class TallerHorario(models.Model):
    taller = models.ForeignKey(Taller, on_delete=models.CASCADE, related_name='horarios_taller')
    horario = models.ForeignKey(Horario, on_delete=models.CASCADE, related_name='talleres_asociados')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('taller', 'horario')

class RespuestaEncuesta(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='respuestas_encuestas')
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name='respuestas')
    respuesta = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('alumno', 'pregunta')

class ServicioCiclo(models.Model):
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='ciclos_asociados')
    ciclo = models.ForeignKey(Ciclo, on_delete=models.CASCADE, related_name='servicios_asociados')
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('servicio', 'ciclo')

    def __str__(self):
        return f"{self.servicio.nombre} - {self.ciclo.nombre}"
