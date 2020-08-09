from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

BASE_DIR = os.path.dirname(PROJECT_DIR)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'gb1o331=@6*(05d@7#hii4r#kasli7-%-+6464p0oza-ldl3t4'

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ['*'] 


STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

COMPRESS_OFFLINE = True
COMPRESS_CSS_FILTERS = [
    'compressor.filters.css_default.CssAbsoluteFilter',
    'compressor.filters.cssmin.CSSMinFilter',
]
COMPRESS_CSS_HASHING_METHOD = 'content'

CACHES = {
	"default": {
		"BACKEND":"django.core.cache.backends.filebased.FileBasedCache",
		"LOCATION": os.path.join(BASE_DIR, 'cache'),
	}
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

try:
    from .local import *
except ImportError:
    pass
