from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
import random
from typing import Iterable

from django.db import transaction
from django.db.utils import OperationalError, ProgrammingError

from .models import Asset


@dataclass(frozen=True)
class _SeedCrypto:
    id: str
    symbol: str
    name: str
    image: str
    current_price: str
    price_change_percentage_24h: str
    market_cap_rank: int


def _status_from_rank(rank: int) -> str:
    return "inactive" if rank % 7 == 0 else "active"


def _base_seed_cryptos() -> list[_SeedCrypto]:
    return [
        _SeedCrypto(
            id="bitcoin",
            symbol="btc",
            name="Bitcoin",
            image="https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
            current_price="43250.5",
            price_change_percentage_24h="2.98",
            market_cap_rank=1,
        ),
        _SeedCrypto(
            id="ethereum",
            symbol="eth",
            name="Ethereum",
            image="https://assets.coingecko.com/coins/images/279/large/ethereum.png",
            current_price="2650.75",
            price_change_percentage_24h="1.17",
            market_cap_rank=2,
        ),
        _SeedCrypto(
            id="binancecoin",
            symbol="bnb",
            name="BNB",
            image="https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
            current_price="315.42",
            price_change_percentage_24h="1.75",
            market_cap_rank=4,
        ),
        _SeedCrypto(
            id="solana",
            symbol="sol",
            name="Solana",
            image="https://assets.coingecko.com/coins/images/4128/large/solana.png",
            current_price="98.5",
            price_change_percentage_24h="2.6",
            market_cap_rank=5,
        ),
        _SeedCrypto(
            id="cardano",
            symbol="ada",
            name="Cardano",
            image="https://assets.coingecko.com/coins/images/975/large/cardano.png",
            current_price="0.52",
            price_change_percentage_24h="1.96",
            market_cap_rank=8,
        ),
        _SeedCrypto(
            id="polkadot",
            symbol="dot",
            name="Polkadot",
            image="https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
            current_price="7.25",
            price_change_percentage_24h="2.11",
            market_cap_rank=12,
        ),
        _SeedCrypto(
            id="chainlink",
            symbol="link",
            name="Chainlink",
            image="https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
            current_price="14.85",
            price_change_percentage_24h="1.71",
            market_cap_rank=14,
        ),
        _SeedCrypto(
            id="polygon",
            symbol="matic",
            name="Polygon",
            image="https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
            current_price="0.85",
            price_change_percentage_24h="2.41",
            market_cap_rank=18,
        ),
        _SeedCrypto(
            id="litecoin",
            symbol="ltc",
            name="Litecoin",
            image="https://assets.coingecko.com/coins/images/2/large/litecoin.png",
            current_price="72.5",
            price_change_percentage_24h="2.11",
            market_cap_rank=20,
        ),
        _SeedCrypto(
            id="avalanche",
            symbol="avax",
            name="Avalanche",
            image="https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png",
            current_price="36.75",
            price_change_percentage_24h="2.08",
            market_cap_rank=9,
        ),
    ]


def _generated_seed_cryptos() -> Iterable[_SeedCrypto]:
    base_names = [
        "Ripple",
        "Dogecoin",
        "Shiba Inu",
        "Uniswap",
        "Cosmos",
        "Algorand",
        "VeChain",
        "Filecoin",
        "TRON",
        "Monero",
        "EOS",
        "Aave",
        "The Graph",
        "Curve",
        "Maker",
        "Compound",
        "Yearn",
        "SushiSwap",
        "1inch",
        "Enjin",
        "Decentraland",
        "Axie",
        "Sandbox",
        "Gala",
        "Immutable",
        "Flow",
        "Tezos",
        "Hedera",
        "Near",
        "Aptos",
    ]

    rng = random.Random(42)

    for index, name in enumerate(base_names):
        symbol = name[:3].lower()
        price = Decimal(str(rng.random() * 100)) + Decimal("0.1")
        rank = 25 + index
        pct_24h = rng.random() * 5 - 2.5

        yield _SeedCrypto(
            id=symbol,
            symbol=symbol,
            name=name,
            image=f"https://assets.coingecko.com/coins/images/{1000 + index}/large/{symbol}.png",
            current_price=str(price),
            price_change_percentage_24h=str(pct_24h),
            market_cap_rank=rank,
        )


def _all_seed_cryptos() -> list[_SeedCrypto]:
    return [*_base_seed_cryptos(), *_generated_seed_cryptos()]


def seed_assets_if_empty() -> bool:
    try:
        if Asset.objects.exists():
            return False
    except (OperationalError, ProgrammingError):
        return False

    assets_to_create: list[Asset] = []
    for crypto in _all_seed_cryptos():
        assets_to_create.append(
            Asset(
                id=crypto.id,
                symbol=crypto.symbol,
                name=crypto.name,
                image=crypto.image,
                status=_status_from_rank(crypto.market_cap_rank),
                current_price=Decimal(crypto.current_price),
                price_change_percentage_24h=Decimal(crypto.price_change_percentage_24h),
                market_cap_rank=crypto.market_cap_rank,
            )
        )

    try:
        with transaction.atomic():
            if Asset.objects.select_for_update().exists():
                return False
            Asset.objects.bulk_create(assets_to_create, ignore_conflicts=True)
    except (OperationalError, ProgrammingError):
        return False

    return True

