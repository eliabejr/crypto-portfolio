import pytest
from decimal import Decimal

from apps.assets.models import Asset


@pytest.mark.unit
@pytest.mark.django_db
class TestAssetModel:
    def test_create_asset(self, asset_factory):
        asset = asset_factory(
            id="bitcoin",
            symbol="BTC",
            name="Bitcoin",
        )

        assert asset.id == "bitcoin"
        assert asset.symbol == "BTC"
        assert asset.name == "Bitcoin"
        assert asset.status == "active"
        assert asset.created_at is not None
        assert asset.updated_at is not None

    def test_asset_str_representation(self, asset_factory):
        asset = asset_factory(symbol="BTC", name="Bitcoin")
        assert str(asset) == "BTC - Bitcoin"

    def test_asset_default_status(self, asset_factory):
        asset = asset_factory()
        assert asset.status == Asset.Status.ACTIVE

    def test_asset_status_choices(self, asset_factory):
        asset = asset_factory(status=Asset.Status.INACTIVE)
        assert asset.status == "inactive"

        asset.status = Asset.Status.ACTIVE
        asset.save()
        assert asset.status == "active"

    def test_asset_optional_fields(self, asset_factory):
        asset = asset_factory(
            current_price=Decimal("50000.12345678"),
            price_change_percentage_24h=Decimal("2.5"),
            market_cap_rank=1,
        )

        assert asset.current_price == Decimal("50000.12345678")
        assert asset.price_change_percentage_24h == Decimal("2.5")
        assert asset.market_cap_rank == 1

    def test_asset_nullable_fields(self, asset_factory):
        asset = asset_factory(
            current_price=None,
            price_change_percentage_24h=None,
            market_cap_rank=None,
        )

        assert asset.current_price is None
        assert asset.price_change_percentage_24h is None
        assert asset.market_cap_rank is None

    def test_asset_unique_id(self, asset_factory, db):
        asset_factory(id="unique-asset-id")

        with pytest.raises(Exception):
            asset_factory(id="unique-asset-id")

    def test_asset_symbol_indexing(self, asset_factory, db):
        asset = asset_factory(symbol="BTC")
        assert Asset._meta.get_field("symbol").db_index is True

    def test_asset_status_indexing(self, asset_factory, db):
        asset = asset_factory(status="active")
        assert Asset._meta.get_field("status").db_index is True

    def test_asset_meta_indexes(self, db):
        indexes = [idx.fields for idx in Asset._meta.indexes]
        assert ["status", "symbol"] in indexes

