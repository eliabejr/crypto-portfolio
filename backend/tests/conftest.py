import pytest
from decimal import Decimal
from uuid import uuid4


@pytest.fixture
def asset_factory(db):
    from apps.assets.models import Asset

    def _create_asset(
        id: str = None,
        symbol: str = "BTC",
        name: str = "Bitcoin",
        image: str = "https://example.com/btc.png",
        status: str = "active",
        current_price: Decimal | None = None,
        price_change_percentage_24h: Decimal | None = None,
        market_cap_rank: int | None = None,
    ) -> Asset:
        if id is None:
            id = f"bitcoin-{uuid4().hex[:8]}"
        return Asset.objects.create(
            id=id,
            symbol=symbol,
            name=name,
            image=image,
            status=status,
            current_price=current_price,
            price_change_percentage_24h=price_change_percentage_24h,
            market_cap_rank=market_cap_rank,
        )

    return _create_asset


@pytest.fixture
def portfolio_item_factory(db, asset_factory):
    from apps.portfolio.models import PortfolioItem

    def _create_portfolio_item(
        asset=None,
        quantity: Decimal = Decimal("1.0"),
        avg_price: Decimal = Decimal("50000.0"),
    ) -> PortfolioItem:
        if asset is None:
            asset = asset_factory()
        return PortfolioItem.objects.create(
            asset=asset,
            quantity=quantity,
            avg_price=avg_price,
        )

    return _create_portfolio_item


@pytest.fixture
def favorite_factory(db, asset_factory):
    from apps.favorites.models import Favorite

    def _create_favorite(asset=None) -> "Favorite":
        if asset is None:
            asset = asset_factory()
        return Favorite.objects.create(asset=asset)

    return _create_favorite


@pytest.fixture
def api_client():
    from django.test import Client

    client = Client()
    return client
