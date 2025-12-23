import pytest
import json
from uuid import UUID

from django.test import Client


@pytest.mark.integration
@pytest.mark.django_db
class TestFavoritesAPI:
    @pytest.fixture
    def client(self):
        return Client()

    def test_list_favorites_empty(self, client):
        response = client.get("/api/favorites")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert data == []

    def test_list_favorites(self, client, favorite_factory):
        favorite1 = favorite_factory()
        favorite2 = favorite_factory()

        response = client.get("/api/favorites")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert len(data) == 2
        assert all("id" in item for item in data)
        assert all("asset" in item for item in data)

    def test_create_favorite(self, client, asset_factory):
        asset = asset_factory(symbol="BTC", name="Bitcoin")

        payload = {"asset_id": asset.id}

        response = client.post(
            "/api/favorites",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert isinstance(UUID(data["id"]), UUID)
        assert data["asset"]["id"] == asset.id
        assert data["asset"]["symbol"] == "BTC"

    def test_create_favorite_asset_not_found(self, client):
        payload = {"asset_id": "non-existent"}

        response = client.post(
            "/api/favorites",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_create_favorite_idempotent(self, client, favorite_factory, asset_factory):
        asset = asset_factory()
        existing_favorite = favorite_factory(asset=asset)

        payload = {"asset_id": asset.id}

        response = client.post(
            "/api/favorites",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert str(data["id"]) == str(existing_favorite.id)

    def test_get_favorite(self, client, favorite_factory):
        favorite = favorite_factory()

        response = client.get(f"/api/favorites/{favorite.id}")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert str(data["id"]) == str(favorite.id)
        assert "asset" in data
        assert data["asset"]["id"] == favorite.asset.id

    def test_get_favorite_not_found(self, client):
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = client.get(f"/api/favorites/{fake_id}")
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_update_favorite(self, client, favorite_factory, asset_factory):
        favorite = favorite_factory()
        new_asset = asset_factory(symbol="ETH", name="Ethereum")

        payload = {"asset_id": new_asset.id}

        response = client.put(
            f"/api/favorites/{favorite.id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert data["asset"]["id"] == new_asset.id
        assert data["asset"]["symbol"] == "ETH"

        from apps.favorites.models import Favorite
        updated_favorite = Favorite.objects.get(id=favorite.id)
        assert updated_favorite.asset.id == new_asset.id

    def test_update_favorite_asset_not_found(self, client, favorite_factory):
        favorite = favorite_factory()

        payload = {"asset_id": "non-existent"}

        response = client.put(
            f"/api/favorites/{favorite.id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_update_favorite_duplicate_asset(self, client, favorite_factory, asset_factory):
        asset1 = asset_factory()
        asset2 = asset_factory()
        favorite1 = favorite_factory(asset=asset1)
        favorite2 = favorite_factory(asset=asset2)

        payload = {"asset_id": asset1.id}

        response = client.put(
            f"/api/favorites/{favorite2.id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 409

        data = json.loads(response.content)
        assert "already exists" in data["detail"].lower()

    def test_update_favorite_not_found(self, client, asset_factory):
        asset = asset_factory()
        fake_id = "00000000-0000-0000-0000-000000000000"

        payload = {"asset_id": asset.id}

        response = client.put(
            f"/api/favorites/{fake_id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_delete_favorite(self, client, favorite_factory):
        favorite = favorite_factory()

        response = client.delete(f"/api/favorites/{favorite.id}")
        assert response.status_code == 204

        from apps.favorites.models import Favorite
        assert not Favorite.objects.filter(id=favorite.id).exists()

    def test_delete_favorite_not_found(self, client):
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = client.delete(f"/api/favorites/{fake_id}")
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

