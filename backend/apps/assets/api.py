from ninja import Router, Schema
from apps.assets.models import Asset


router = Router()


class AssetOut(Schema):
    id: str
    symbol: str
    name: str
    image: str
    status: str
    current_price: float | None = None
    price_change_percentage_24h: float | None = None
    market_cap_rank: int | None = None


@router.get("", response=list[AssetOut])
def list_assets(request):
    qs = Asset.objects.order_by("market_cap_rank", "symbol")
    return list(qs)

