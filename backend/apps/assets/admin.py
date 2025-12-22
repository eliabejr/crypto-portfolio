from django.contrib import admin
from apps.assets.models import Asset


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ("id", "symbol", "name", "status", "market_cap_rank", "updated_at")
    list_filter = ("status",)
    search_fields = ("id", "symbol", "name")

