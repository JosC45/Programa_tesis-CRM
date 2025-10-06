# core/settings/prod.py
from base import *
#import dj_database_url

DEBUG = False
ALLOWED_HOSTS = ['api.midominio.com', 'www.midominio.com']

# Base de datos PostgreSQL (usa variables de entorno)
DATABASES = {
    #'default': dj_database_url.config(
    #    default=os.getenv('DATABASE_URL')
    #)
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        "NAME": env("DB_NAME"),
        "USER": env("DB_USER"),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env("DB_HOST"),
    }
}

# Seguridad
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Archivos estáticos para producción
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

# CORS
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE.insert(2, 'corsheaders.middleware.CorsMiddleware')
CORS_ALLOWED_ORIGINS = [
    "https://mi-frontend.com",
]

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'WARNING',
            'propagate': True,
        },
    },
}
