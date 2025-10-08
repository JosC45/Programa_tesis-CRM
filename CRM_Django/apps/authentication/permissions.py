from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permiso personalizado para asegurarse de que el usuario tiene el rol de admin.
    """

    def has_permission(self, request, view):
        return request.user.role.name == 'admin'
