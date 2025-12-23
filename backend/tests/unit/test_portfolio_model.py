import pytest
from decimal import Decimal
from uuid import UUID

from apps.portfolio.models import PortfolioItem


@pytest.mark.unit
@pytest.mark.django_db
class TestPortfolioItemModel:
    def test_create_portfolio_item(self, portfolio_item_factory, asset_factory):
        asset = asset_factory(symbol="BTC", name="Bitcoin")
        item = portfolio_item_factory(
            asset=asset,
            quantity=Decimal("0.5"),
            avg_price=Decimal("50000.0"),
        )

        assert isinstance(item.id, UUID)
        assert item.asset == asset
        assert item.quantity == Decimal("0.5")
        assert item.avg_price == Decimal("50000.0")
        assert item.created_at is not None
        assert item.updated_at is not None

    def test_portfolio_item_str_representation(self, portfolio_item_factory):
        item = portfolio_item_factory(
            quantity=Decimal("1.5"),
            avg_price=Decimal("50000.0"),
        )
        expected = f"{item.asset.symbol.upper()} - 1.5 @ 50000.0"
        assert str(item) == expected

    def test_portfolio_item_one_to_one_relationship(self, portfolio_item_factory, asset_factory, db):
        asset = asset_factory()
        item = portfolio_item_factory(asset=asset)

        assert asset.portfolio_item == item
        assert item.asset == asset

    def test_portfolio_item_unique_asset_constraint(self, portfolio_item_factory, asset_factory, db):
        asset = asset_factory()
        portfolio_item_factory(asset=asset)

        with pytest.raises(Exception):
            portfolio_item_factory(asset=asset)

    def test_portfolio_item_precision(self, portfolio_item_factory):
        item = portfolio_item_factory(
            quantity=Decimal("0.12345678"),
            avg_price=Decimal("50000.12345678"),
        )

        assert item.quantity == Decimal("0.12345678")
        assert item.avg_price == Decimal("50000.12345678")

    def test_portfolio_item_protect_on_delete(self, portfolio_item_factory, asset_factory, db):
        asset = asset_factory()
        item = portfolio_item_factory(asset=asset)

        from django.db.models.deletion import ProtectedError
        with pytest.raises(ProtectedError):
            asset.delete()

        item.delete()
        asset.delete()
        from apps.assets.models import Asset
        assert not Asset.objects.filter(id=asset.id).exists()

    def test_portfolio_item_auto_timestamps(self, portfolio_item_factory):
        import time
        before = time.time()
        item = portfolio_item_factory()
        after = time.time()

        assert item.created_at.timestamp() >= before
        assert item.created_at.timestamp() <= after
        assert item.updated_at.timestamp() >= before
        assert item.updated_at.timestamp() <= after

    def test_portfolio_item_update_timestamp(self, portfolio_item_factory):
        import time
        item = portfolio_item_factory()
        original_updated_at = item.updated_at

        time.sleep(0.01)
        item.quantity = Decimal("2.0")
        item.save()

        assert item.updated_at > original_updated_at

