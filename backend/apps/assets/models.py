from django.db import models

class Asset(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"

    id = models.CharField(primary_key=True, max_length=64)

    symbol = models.CharField(max_length=24, db_index=True)
    name = models.CharField(max_length=128)
    image = models.URLField(blank=True, default="")
    status = models.CharField(
        max_length=8, choices=Status.choices, default=Status.ACTIVE, db_index=True
    )

    current_price = models.DecimalField(
        max_digits=20, decimal_places=8, null=True, blank=True
    )
    price_change_percentage_24h = models.DecimalField(
        max_digits=10, decimal_places=4, null=True, blank=True
    )
    market_cap_rank = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["status", "symbol"]),
        ]

    def __str__(self) -> str:
        return f"{self.symbol.upper()} - {self.name}"

