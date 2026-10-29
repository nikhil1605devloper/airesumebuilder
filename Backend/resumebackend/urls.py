from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include


def home(request):
    return JsonResponse({
        "status": "success",
        "message": "AI Resume Builder Backend is running",
        "api": "/api/"
    })


urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('resume_ai.urls')),
] 