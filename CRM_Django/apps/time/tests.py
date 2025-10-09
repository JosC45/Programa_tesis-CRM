# apps/time/tests.py
from rest_framework.test import APITestCase
from rest_framework import status
from apps.time.models.schedules import Schedule
from apps.time.models.days import Day
from django.contrib.auth.models import User

class ScheduleAPITestCase(APITestCase):
    def setUp(self):
        # Crear un usuario (si la autenticación está configurada)
        self.user = User.objects.create_user(username='testuser', password='password123')
        
        # Crear un Day (esto depende de tu implementación de Day)
        self.day = Day.objects.create(name="Monday") # pylint: disable=no-member

        # Definir los datos válidos e inválidos para las pruebas
        self.valid_data = {
            "start_time": "08:00:00",
            "end_time": "10:00:00",
            "day": self.day.id  # Usamos el ID del objeto Day
        }

        self.invalid_data = {
            "start_time": "10:00:00",
            "end_time": "08:00:00",  # start_time es después de end_time
            "day": self.day.id
        }

    def test_create_schedule_valid(self):
        """Test crear una nueva programación con tiempos válidos."""
        url = "/api/time/schedules/"  # Asegúrate de que esta sea la URL correcta en tu archivo urls.py
        response = self.client.post(url, self.valid_data, format='json')
        
        # Verificar que la respuesta sea exitosa (201 - Created)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verificar que los datos se guardaron correctamente
        schedule = Schedule.objects.get(id=response.data["id"]) # pylint: disable=no-member
        self.assertEqual(schedule.start_time.strftime("%H:%M:%S"), "08:00:00")
        self.assertEqual(schedule.end_time.strftime("%H:%M:%S"), "10:00:00")

    def test_create_schedule_invalid(self):
        """Test que no se puede crear una programación con horarios inválidos."""
        url = "/api/time/schedules/"
        response = self.client.post(url, self.invalid_data, format='json')
        
        # Verificar que la respuesta sea un error de validación
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("The end time must be after the start time.", response.data["non_field_errors"])

    def test_get_schedule(self):
        """Test que obtienes una programación específica."""
        schedule = Schedule.objects.create(start_time="08:00:00", end_time="10:00:00", day=self.day) # pylint: disable=no-member
        url = f"/api/time/schedules/{schedule.id}/"
        response = self.client.get(url)
        
        # Verificar que el código de respuesta sea 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que los datos sean correctos
        self.assertEqual(response.data["start_time"], "08:00:00")
        self.assertEqual(response.data["end_time"], "10:00:00")

    def test_list_schedules(self):
        """Test que obtienes la lista de programaciones."""
        schedule1 = Schedule.objects.create(start_time="08:00:00", end_time="10:00:00", day=self.day) # pylint: disable=no-member
        schedule2 = Schedule.objects.create(start_time="10:00:00", end_time="12:00:00", day=self.day) # pylint: disable=no-member
        
        url = "/api/time/schedules/"
        response = self.client.get(url)
        
        # Verificar que la respuesta tenga un código 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que el número de resultados sea 2
        self.assertEqual(len(response.data), 2)
