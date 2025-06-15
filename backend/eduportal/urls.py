from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from feedback.views import FeedbackAnalytics
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="EduPortal API",
        default_version='v1',
        description="API для освітнього порталу Data Science",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courses.urls')),
    path('api/feedback/analytics/', FeedbackAnalytics.as_view(), name='feedback-analytics'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)