
import pytest
from uuid import UUID

from apps.favorites.models import Favorite


@pytest.mark.unit
@pytest.mark.django_db
class TestFavoriteModel:
    def test_create_favorite(self, favorite_factory, asset_factory):
        asset = asset_factory(symbol="BTC", name="Bitcoin")
        favorite = favorite_factory(asset=asset)

        assert isinstance(favorite.id, UUID)
        assert favorite.asset == asset
        assert favorite.created_at is not None
        assert favorite.updated_at is not None

    def test_favorite_foreign_key_relationship(self, favorite_factory, asset_factory, db):
        asset = asset_factory()
        favorite = favorite_factory(asset=asset)

        assert favorite in asset.favorites.all()
        assert favorite.asset == asset

    def test_multiple_favorites_per_asset_allowed(self, favorite_factory, asset_factory, db):   
        asset = asset_factory()
        favorite1 = favorite_factory(asset=asset)
        favorite2 = favorite_factory(asset=asset)

        assert favorite1.id != favorite2.id
        assert favorite1.asset == favorite2.asset == asset
        assert asset.favorites.count() == 2

    def test_favorite_cascade_on_delete(self, favorite_factory, asset_factory, db):
        asset = asset_factory()
        favorite = favorite_factory(asset=asset)

        asset_id = asset.id
        favorite_id = favorite.id

        asset.delete()

        assert not Favorite.objects.filter(id=favorite_id).exists()
        from apps.assets.models import Asset
        assert not Asset.objects.filter(id=asset_id).exists()

    def test_favorite_auto_timestamps(self, favorite_factory):
        import time
        before = time.time()
        favorite = favorite_factory()
        after = time.time()

        assert favorite.created_at.timestamp() >= before
        assert favorite.created_at.timestamp() <= after
        assert favorite.updated_at.timestamp() >= before
        assert favorite.updated_at.timestamp() <= after

    def test_favorite_update_timestamp(self, favorite_factory):
        import time
        favorite = favorite_factory()
        original_updated_at = favorite.updated_at

        time.sleep(0.01)
        from apps.assets.models import Asset
        new_asset = Asset.objects.create(
            id=f"new-asset-{favorite.id}",
            symbol="ETH",
            name="Ethereum",
        )
        favorite.asset = new_asset
        favorite.save()

        assert favorite.updated_at > original_updated_at

