from ninja import Router, Schema
from ninja.errors import HttpError

from apps.assets.api import AssetOut
from apps.assets.models import Asset
from apps.portfolio.models import PortfolioItem

router = Router()


class PortfolioItemCreateIn(Schema):
    asset_id: str
    quantity: float
    avg_price: float


class PortfolioItemUpdateIn(Schema):
    quantity: float | None = None
    avg_price: float | None = None


class PortfolioItemOut(Schema):
    id: str
    asset: AssetOut
    quantity: float
    avg_price: float


@router.get("", response=list[PortfolioItemOut])
def list_portfolio(request):
    qs = PortfolioItem.objects.select_related("asset").order_by("-updated_at")
    return list(qs)


@router.post("", response=PortfolioItemOut)
def create_portfolio_item(request, payload: PortfolioItemCreateIn):
    asset = Asset.objects.filter(id=payload.asset_id).first()
    if not asset:
        raise HttpError(404, "Asset not found")

    existing = PortfolioItem.objects.filter(asset=asset).select_related("asset").first()
    if existing:
        raise HttpError(409, "Portfolio item already exists for asset")

    return PortfolioItem.objects.create(
        asset=asset,
        quantity=payload.quantity,
        avg_price=payload.avg_price,
    )


@router.get("/{portfolio_item_id}", response=PortfolioItemOut)
def get_portfolio_item(request, portfolio_item_id: str):
    item = (
        PortfolioItem.objects.filter(id=portfolio_item_id)
        .select_related("asset")
        .first()
    )
    if not item:
        raise HttpError(404, "Portfolio item not found")
    return item


@router.put("/{portfolio_item_id}", response=PortfolioItemOut)
def update_portfolio_item(
    request, portfolio_item_id: str, payload: PortfolioItemUpdateIn
):
    item = (
        PortfolioItem.objects.filter(id=portfolio_item_id)
        .select_related("asset")
        .first()
    )
    if not item:
        raise HttpError(404, "Portfolio item not found")

    changed = False
    update_fields: list[str] = []

    if payload.quantity is not None:
        item.quantity = payload.quantity
        update_fields.append("quantity")
        changed = True
    if payload.avg_price is not None:
        item.avg_price = payload.avg_price
        update_fields.append("avg_price")
        changed = True

    if changed:
        update_fields.append("updated_at")
        item.save(update_fields=update_fields)

    return item


@router.delete("/{portfolio_item_id}", response={204: None})
def delete_portfolio_item(request, portfolio_item_id: str):
    deleted, _ = PortfolioItem.objects.filter(id=portfolio_item_id).delete()
    if not deleted:
        raise HttpError(404, "Portfolio item not found")
    return 204, None

