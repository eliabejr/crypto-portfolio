from django.contrib import admin
from django.urls import path

from config.api import api
from apps.assets.api import router as assets_router
from apps.favorites.api import router as favorites_router
from apps.portfolio.api import router as portfolio_router


api.add_router("/assets", assets_router, tags=["assets"])
api.add_router("/favorites", favorites_router, tags=["favorites"])
api.add_router("/portfolio", portfolio_router, tags=["portfolio"])

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]

