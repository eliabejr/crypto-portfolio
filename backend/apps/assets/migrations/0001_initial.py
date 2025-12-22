from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Asset",
            fields=[
                ("id", models.CharField(max_length=64, primary_key=True, serialize=False)),
                ("symbol", models.CharField(db_index=True, max_length=24)),
                ("name", models.CharField(max_length=128)),
                ("image", models.URLField(blank=True, default="")),
                (
                    "status",
                    models.CharField(
                        choices=[("active", "Active"), ("inactive", "Inactive")],
                        db_index=True,
                        default="active",
                        max_length=8,
                    ),
                ),
                (
                    "current_price",
                    models.DecimalField(blank=True, decimal_places=8, max_digits=20, null=True),
                ),
                (
                    "price_change_percentage_24h",
                    models.DecimalField(
                        blank=True, decimal_places=4, max_digits=10, null=True
                    ),
                ),
                ("market_cap_rank", models.PositiveIntegerField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={},
        ),
        migrations.AddIndex(
            model_name="asset",
            index=models.Index(fields=["status", "symbol"], name="assets_asse_status_7fb64f_idx"),
        ),
    ]

