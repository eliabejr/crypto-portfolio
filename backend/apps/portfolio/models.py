import uuid

from django.db import models


class PortfolioItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    asset = models.OneToOneField(
        "assets.Asset",
        on_delete=models.PROTECT,
        related_name="portfolio_item",
    )

    quantity = models.DecimalField(max_digits=28, decimal_places=8)
    avg_price = models.DecimalField(max_digits=20, decimal_places=8)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["asset"]),
        ]

    def __str__(self) -> str:
        return f"{self.asset.symbol.upper()} - {self.quantity} @ {self.avg_price}"

