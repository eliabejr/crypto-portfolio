from django.apps import AppConfig


class AssetsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.assets"

    def ready(self) -> None:
        import os
        from django.conf import settings

        if os.getenv("DJANGO_SEED_ASSETS", "true").lower() != "true":
            return

        if settings.DEBUG and os.environ.get("RUN_MAIN") != "true":
            return

        from .seed import seed_assets_if_empty

        seed_assets_if_empty()

