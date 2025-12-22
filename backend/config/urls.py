from django.contrib import admin
from django.urls import path

from config.api import api
from apps.assets.api import router as assets_router


api.add_router("/assets", assets_router, tags=["assets"])

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]

