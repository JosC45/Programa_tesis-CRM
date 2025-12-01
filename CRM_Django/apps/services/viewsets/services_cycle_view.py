from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from ..serializers.service_cycle_serializer import ServiceCycleSerializer
from ..models.services_cycle import ServicesCycle
from rest_framework_simplejwt.tokens import AccessToken

class ServiceCycleViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset=ServicesCycle.objects.all() # pylint: disable=no-member
    serializer_class=ServiceCycleSerializer
    

    def perform_create(self, serializer):
        # Llenamos created_by con el usuario autenticado
        print(f"Authorization Header: {self.request.headers.get('Authorization')}")
        try:
        # Intenta decodificar el token para verificar que sea válido
            token = self.request.headers.get('Authorization').split(' ')[1]
            decoded_token = AccessToken(token)
            print(f"Decoded Token: {decoded_token}")
        except Exception as e:
            print(f"Error al decodificar el token: {e}")
        if not self.request.user.is_authenticated:
            raise AuthenticationFailed("User not authenticated")
        print(f"Usuario autenticado: {self.request.user}")
        serializer.save(created_by=self.request.user)
    

    def perform_update(self, serializer):
        # Llenamos updated_by con el usuario autenticado
        print(self.request.user) 
        if not self.request.user.is_authenticated:
            raise AuthenticationFailed("User not authenticated")
        print(f"Usuario autenticado: {self.request.user}")
        serializer.save(updated_by=self.request.user)