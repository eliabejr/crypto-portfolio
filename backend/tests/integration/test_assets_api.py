import pytest
import json
from decimal import Decimal

from django.test import Client


@pytest.mark.integration
@pytest.mark.django_db
class TestAssetsAPI:

    @pytest.fixture
    def client(self):
        return Client()

    def test_list_assets_empty(self, client):
        response = client.get("/api/assets")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert data["data"] == []
        assert data["page"] == 1
        assert data["pageSize"] == 20
        assert data["total"] == 0
        assert data["hasMore"] is False

    def test_list_assets(self, client, asset_factory):
        asset1 = asset_factory(symbol="BTC", name="Bitcoin", market_cap_rank=1)
        asset2 = asset_factory(symbol="ETH", name="Ethereum", market_cap_rank=2)

        response = client.get("/api/assets")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert len(data["data"]) == 2
        assert data["total"] == 2
        assert data["hasMore"] is False

        symbols = [item["symbol"] for item in data["data"]]
        assert "BTC" in symbols
        assert "ETH" in symbols

    def test_list_assets_with_pagination(self, client, asset_factory):
        for i in range(25):
            asset_factory(symbol=f"CRYPTO{i}", name=f"Crypto {i}", market_cap_rank=i + 1)

        response = client.get("/api/assets", {"page": 1, "page_size": 10})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 10
        assert data["page"] == 1
        assert data["pageSize"] == 10
        assert data["total"] == 25
        assert data["hasMore"] is True

        response = client.get("/api/assets", {"page": 2, "page_size": 10})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 10
        assert data["page"] == 2
        assert data["hasMore"] is True

        response = client.get("/api/assets", {"page": 3, "page_size": 10})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 5
        assert data["page"] == 3
        assert data["hasMore"] is False

    def test_list_assets_with_search(self, client, asset_factory):
        asset_factory(id="bitcoin", symbol="BTC", name="Bitcoin")
        asset_factory(id="ethereum", symbol="ETH", name="Ethereum")
        asset_factory(id="bitcoin-cash", symbol="BCH", name="Bitcoin Cash")

        response = client.get("/api/assets", {"search": "BTC"})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 1
        assert data["data"][0]["symbol"] == "BTC"

        response = client.get("/api/assets", {"search": "BT"})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 1
        assert data["data"][0]["symbol"] == "BTC"

        response = client.get("/api/assets", {"search": "Bitcoin"})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 2
        names = [item["name"] for item in data["data"]]
        assert "Bitcoin" in names
        assert "Bitcoin Cash" in names

        response = client.get("/api/assets", {"search": "Cash"})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 1
        assert data["data"][0]["name"] == "Bitcoin Cash"

        response = client.get("/api/assets", {"search": "ethereum"})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 1
        assert data["data"][0]["id"] == "ethereum"

        response = client.get("/api/assets", {"search": "bitcoin"})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert len(data["data"]) == 2
        ids = [item["id"] for item in data["data"]]
        assert "bitcoin" in ids
        assert "bitcoin-cash" in ids

    def test_list_assets_pagination_bounds(self, client, asset_factory):
        asset_factory(symbol="BTC", name="Bitcoin")

        response = client.get("/api/assets", {"page": 0})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data["page"] == 1

        response = client.get("/api/assets", {"page": -1})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data["page"] == 1

        response = client.get("/api/assets", {"page_size": 200})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data["pageSize"] == 100

        response = client.get("/api/assets", {"page_size": 0})
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data["pageSize"] == 1

    def test_get_asset_by_id(self, client, asset_factory):
        asset = asset_factory(
            id="bitcoin",
            symbol="BTC",
            name="Bitcoin",
            current_price=Decimal("50000.12345678"),
            price_change_percentage_24h=Decimal("2.5"),
            market_cap_rank=1,
        )

        response = client.get(f"/api/assets/{asset.id}")
        assert response.status_code == 200

        data = json.loads(response.content)
        assert data["id"] == "bitcoin"
        assert data["symbol"] == "BTC"
        assert data["name"] == "Bitcoin"
        assert float(data["current_price"]) == 50000.12345678
        assert float(data["price_change_percentage_24h"]) == 2.5
        assert data["market_cap_rank"] == 1

    def test_get_asset_not_found(self, client):
        response = client.get("/api/assets/non-existent")
        assert response.status_code == 404

        data = json.loads(response.content)
        assert "not found" in data["detail"].lower()

    def test_list_assets_ordered_by_market_cap_rank(self, client, asset_factory):
        asset_factory(symbol="ETH", market_cap_rank=2)
        asset_factory(symbol="BTC", market_cap_rank=1)
        asset_factory(symbol="BNB", market_cap_rank=3)
        asset_factory(symbol="NO_RANK", market_cap_rank=None)

        response = client.get("/api/assets")
        assert response.status_code == 200

        data = json.loads(response.content)
        symbols = [item["symbol"] for item in data["data"]]
        assert symbols[0] == "BTC"
        assert symbols[1] == "ETH"
        assert symbols[2] == "BNB"
        assert symbols[3] == "NO_RANK"

