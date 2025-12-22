import uuid

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("assets", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PortfolioItem",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4, editable=False, primary_key=True, serialize=False
                    ),
                ),
                (
                    "asset",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="portfolio_item",
                        to="assets.asset",
                    ),
                ),
                ("quantity", models.DecimalField(decimal_places=8, max_digits=28)),
                ("avg_price", models.DecimalField(decimal_places=8, max_digits=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={},
        ),
        migrations.AddIndex(
            model_name="portfolioitem",
            index=models.Index(
                fields=["asset"], name="portfolio_por_asset_52d3de_idx"
            ),
        ),
    ]

