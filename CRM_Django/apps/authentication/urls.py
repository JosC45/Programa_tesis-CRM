from django.urls import include, path, re_path
from .views.loginView import LoginView
from .views.registerView import RegisterView




urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
]