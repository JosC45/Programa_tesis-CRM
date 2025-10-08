from django.contrib import admin
from .models.roles import Role
from .models.users import User

# Register your models here.


admin.site.register(User)
admin.site.register(Role)