from django.db.models import F, Q
from ninja import Router, Schema
from ninja.errors import HttpError
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


class AssetListOut(Schema):
    data: list[AssetOut]
    page: int
    pageSize: int
    total: int
    hasMore: bool


@router.get("", response=AssetListOut)
def list_assets(
    request,
    page: int = 1,
    page_size: int = 20,
    search: str = "",
):
    page = max(1, page)
    page_size = min(max(1, page_size), 100)

    qs = Asset.objects.all()
    if search:
        qs = qs.filter(
            Q(symbol__icontains=search)
            | Q(name__icontains=search)
            | Q(id__icontains=search)
        )

    qs = qs.order_by(F("market_cap_rank").asc(nulls_last=True), "symbol")

    total = qs.count()
    offset = (page - 1) * page_size
    items = list(qs[offset : offset + page_size])

    return {
        "data": items,
        "page": page,
        "pageSize": page_size,
        "total": total,
        "hasMore": offset + page_size < total,
    }


@router.get("/{asset_id}", response=AssetOut)
def get_asset(request, asset_id: str):
    asset = Asset.objects.filter(id=asset_id).first()
    if not asset:
        raise HttpError(404, "Asset not found")
    return asset

