from rest_framework.permissions import IsAdminUser
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models.users import User
from ..models.roles import Role
from ..serializers.usersSerializer import UserSerializer
from rest_framework import generics
from utils.permissions.isAdminUser import IsAdminUser


class RegisterView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]  # Solo el admin puede registrar nuevos usuarios
    serializer_class = UserSerializer

    def post(self, request):
        
        role_id = request.data.get('role_id')  # Asumimos que el admin asigna un rol
        user_data = {
            'username': request.data.get('username'),
            'password': request.data.get('password'),
            'email': request.data.get('email'),
        }
        
        try:
            role = Role.objects.get(id=role_id)  # pylint: disable=no-member
            user = User.objects.create_user(**user_data)
            user.role = role
            user.save()
            serializer = self.get_serializer(user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Role.DoesNotExist: # pylint: disable=no-member
            return Response({"detail": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)