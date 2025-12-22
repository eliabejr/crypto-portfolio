from uuid import UUID

from ninja import Router, Schema
from ninja.errors import HttpError

from apps.assets.api import AssetOut
from apps.assets.models import Asset
from apps.favorites.models import Favorite

router = Router()


class FavoriteCreateIn(Schema):
    asset_id: str


class FavoriteUpdateIn(Schema):
    asset_id: str


class FavoriteOut(Schema):
    id: UUID
    asset: AssetOut


@router.get("", response=list[FavoriteOut])
def list_favorites(request):
    qs = Favorite.objects.select_related("asset").order_by("-created_at")
    return list(qs)


@router.post("", response=FavoriteOut)
def create_favorite(request, payload: FavoriteCreateIn):
    asset = Asset.objects.filter(id=payload.asset_id).first()
    if not asset:
        raise HttpError(404, "Asset not found")

    favorite = Favorite.objects.filter(asset=asset).select_related("asset").first()
    if favorite:
        return favorite

    return Favorite.objects.create(asset=asset)


@router.get("/{favorite_id}", response=FavoriteOut)
def get_favorite(request, favorite_id: UUID):
    favorite = Favorite.objects.filter(id=favorite_id).select_related("asset").first()
    if not favorite:
        raise HttpError(404, "Favorite not found")
    return favorite


@router.put("/{favorite_id}", response=FavoriteOut)
def update_favorite(request, favorite_id: UUID, payload: FavoriteUpdateIn):
    favorite = Favorite.objects.filter(id=favorite_id).select_related("asset").first()
    if not favorite:
        raise HttpError(404, "Favorite not found")

    asset = Asset.objects.filter(id=payload.asset_id).first()
    if not asset:
        raise HttpError(404, "Asset not found")

    existing = Favorite.objects.filter(asset=asset).exclude(id=favorite_id).first()
    if existing:
        raise HttpError(409, "Favorite already exists for asset")

    favorite.asset = asset
    favorite.save(update_fields=["asset", "updated_at"])
    return favorite


@router.delete("/{favorite_id}", response={204: None})
def delete_favorite(request, favorite_id: UUID):
    deleted, _ = Favorite.objects.filter(id=favorite_id).delete()
    if not deleted:
        raise HttpError(404, "Favorite not found")
    return 204, None

