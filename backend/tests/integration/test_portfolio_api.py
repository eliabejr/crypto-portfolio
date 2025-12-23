
import pytest
import json
from decimal import Decimal
from uuid import UUID

from django.test import Client


@pytest.mark.integration
@pytest.mark.django_db
class TestPortfolioAPI:
    @pytest.fixture
    def client(self):
        return Client()

    def test_list_portfolio_empty(self, client):
        response = client.get("/api/portfolio")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert data == []

    def test_list_portfolio(self, client, portfolio_item_factory):
        item1 = portfolio_item_factory(quantity=Decimal("1.0"), avg_price=Decimal("50000.0"))
        item2 = portfolio_item_factory(quantity=Decimal("2.5"), avg_price=Decimal("3000.0"))

        response = client.get("/api/portfolio")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert len(data) == 2
        assert all("id" in item for item in data)
        assert all("asset" in item for item in data)
        assert all("quantity" in item for item in data)
        assert all("avg_price" in item for item in data)

    def test_create_portfolio_item(self, client, asset_factory):
        asset = asset_factory(symbol="BTC", name="Bitcoin")

        payload = {
            "asset_id": asset.id,
            "quantity": 1.5,
            "avg_price": 50000.0,
        }

        response = client.post(
            "/api/portfolio",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert isinstance(UUID(data["id"]), UUID)
        assert data["asset"]["id"] == asset.id
        assert data["asset"]["symbol"] == "BTC"
        assert float(data["quantity"]) == 1.5
        assert float(data["avg_price"]) == 50000.0

    def test_create_portfolio_item_asset_not_found(self, client):
        payload = {
            "asset_id": "non-existent",
            "quantity": 1.0,
            "avg_price": 50000.0,
        }

        response = client.post(
            "/api/portfolio",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_create_portfolio_item_duplicate(self, client, portfolio_item_factory, asset_factory):
        asset = asset_factory()
        portfolio_item_factory(asset=asset)

        payload = {
            "asset_id": asset.id,
            "quantity": 2.0,
            "avg_price": 60000.0,
        }

        response = client.post(
            "/api/portfolio",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 409

        data = json.loads(response.content)
        assert "already exists" in data["detail"].lower()

    def test_get_portfolio_item(self, client, portfolio_item_factory):
        item = portfolio_item_factory(quantity=Decimal("1.5"), avg_price=Decimal("50000.0"))

        response = client.get(f"/api/portfolio/{item.id}")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert str(data["id"]) == str(item.id)
        assert float(data["quantity"]) == 1.5
        assert float(data["avg_price"]) == 50000.0
        assert "asset" in data

    def test_get_portfolio_item_not_found(self, client):
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = client.get(f"/api/portfolio/{fake_id}")
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_update_portfolio_item(self, client, portfolio_item_factory):
        item = portfolio_item_factory(quantity=Decimal("1.0"), avg_price=Decimal("50000.0"))

        payload = {
            "quantity": 2.5,
            "avg_price": 60000.0,
        }

        response = client.put(
            f"/api/portfolio/{item.id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert float(data["quantity"]) == 2.5
        assert float(data["avg_price"]) == 60000.0

        from apps.portfolio.models import PortfolioItem
        updated_item = PortfolioItem.objects.get(id=item.id)
        assert updated_item.quantity == Decimal("2.5")
        assert updated_item.avg_price == Decimal("60000.0")

    def test_update_portfolio_item_partial(self, client, portfolio_item_factory):
        item = portfolio_item_factory(quantity=Decimal("1.0"), avg_price=Decimal("50000.0"))

        payload = {"quantity": 3.0}

        response = client.put(
            f"/api/portfolio/{item.id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert float(data["quantity"]) == 3.0
        assert float(data["avg_price"]) == 50000.0

        payload = {"avg_price": 70000.0}

        response = client.put(
            f"/api/portfolio/{item.id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert float(data["quantity"]) == 3.0
        assert float(data["avg_price"]) == 70000.0

    def test_update_portfolio_item_not_found(self, client):
        fake_id = "00000000-0000-0000-0000-000000000000"
        payload = {"quantity": 2.0}

        response = client.put(
            f"/api/portfolio/{fake_id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_update_portfolio_item_no_changes(self, client, portfolio_item_factory):
        item = portfolio_item_factory(quantity=Decimal("1.0"), avg_price=Decimal("50000.0"))
        original_updated_at = item.updated_at

        payload = {}

        response = client.put(
            f"/api/portfolio/{item.id}",
            data=json.dumps(payload),
            content_type="application/json",
        )
        assert response.status_code == 200

        data = json.loads(response.content)
        assert float(data["quantity"]) == 1.0
        assert float(data["avg_price"]) == 50000.0

    def test_delete_portfolio_item(self, client, portfolio_item_factory):
        item = portfolio_item_factory()

        response = client.delete(f"/api/portfolio/{item.id}")
        assert response.status_code == 204

        from apps.portfolio.models import PortfolioItem
        assert not PortfolioItem.objects.filter(id=item.id).exists()

    def test_delete_portfolio_item_not_found(self, client):
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = client.delete(f"/api/portfolio/{fake_id}")
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

