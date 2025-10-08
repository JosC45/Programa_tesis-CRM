from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..models.users import User
from rest_framework import generics , status
from apps.authentication.serializers.usersSerializer import UserSerializer

class LoginView(generics.GenericAPIView):

    serializer_class=UserSerializer
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Verificar si el usuario existe en la base de datos antes de intentar autenticarlo
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist: # pylint: disable=no-member
            return Response({"detail": "User not found."}, status=404)

        # Ahora intentar autenticar al usuario
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            user_data = UserSerializer(user).data
            
            response_data = {
                'user': user_data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(response_data, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid password."}, status=status.HTTP_401_UNAUTHORIZED)