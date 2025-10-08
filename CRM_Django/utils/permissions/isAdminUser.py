from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permiso personalizado para asegurarse de que el usuario está autenticado
    y tiene el rol de 'admin'.
    """

    def has_permission(self, request, view):
        # Primero, asegurarse de que el usuario esté autenticado
        if not request.user.is_authenticated:
            return False  # Si no está autenticado, no tiene permiso

        # Luego, verificar el rol del usuario
        return request.user.role.name == 'admin'
