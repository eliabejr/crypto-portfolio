from django.core.management.base import BaseCommand

from apps.assets.seed import seed_assets_if_empty


class Command(BaseCommand):
    help = "Seed the assets"

    def handle(self, *args, **options):
        inserted = seed_assets_if_empty()
        if inserted:
            self.stdout.write(self.style.SUCCESS("seeded"))
        else:
            self.stdout.write("assets exists. skipping...")

