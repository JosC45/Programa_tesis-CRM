# core/settings/dev.py
from base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

# Base de datos SQLite para desarrollo
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Permitir CORS (si usas frontend local)
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE.insert(2, 'corsheaders.middleware.CorsMiddleware')
CORS_ALLOW_ALL_ORIGINS = True

# Email en consola
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'