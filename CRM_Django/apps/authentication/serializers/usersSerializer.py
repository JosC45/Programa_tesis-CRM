from rest_framework import serializers
from ..models.users import User
from .rolesSerializer import RoleSerializer

class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')