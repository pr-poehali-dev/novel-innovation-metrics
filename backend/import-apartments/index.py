import os
import json
import urllib.request
import xml.etree.ElementTree as ET
import psycopg2


NS = "http://webmaster.yandex.ru/schemas/feed/realty/2010-06"


def t(el, tag):
    node = el.find(f"{{{NS}}}{tag}")
    return node.text.strip() if node is not None and node.text else None


def ti(el, tag):
    val = t(el, tag)
    try:
        return int(val) if val else None
    except (ValueError, TypeError):
        return None


def tf(el, tag):
    val = t(el, tag)
    try:
        return float(val) if val else None
    except (ValueError, TypeError):
        return None


def handler(event: dict, context) -> dict:
    """Импортирует квартиры из XML фида nmarket.pro в базу данных"""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    xml_url = os.environ.get(
        "NMARKET_XML_URL",
        "https://ecatalog-service.nmarket.pro/BasePro/?login=omkrol_yandex_ru&password=94EB7fK9n&regionGroupId=39"
    )

    req = urllib.request.Request(xml_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        xml_data = resp.read()

    root = ET.fromstring(xml_data)
    offers = root.findall(f"{{{NS}}}offer")

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    cur = conn.cursor()

    inserted = 0
    updated = 0

    for offer in offers:
        internal_id = offer.get("internal-id")
        if not internal_id:
            continue

        images = [
            img.text.strip()
            for img in offer.findall(f"{{{NS}}}image")
            if img.text
        ]

        location = offer.find(f"{{{NS}}}location")
        address = t(location, "address") if location is not None else None
        region = t(location, "region") if location is not None else None
        locality = t(location, "locality-name") if location is not None else None
        sub_locality = t(location, "sub-locality-name") if location is not None else None

        price_el = offer.find(f"{{{NS}}}price")
        price_val = None
        currency = "RUR"
        if price_el is not None:
            try:
                price_val = int(float(t(price_el, "value") or 0))
            except (ValueError, TypeError):
                price_val = None
            currency = t(price_el, "currency") or "RUR"

        sales_agent = offer.find(f"{{{NS}}}sales-agent")
        agent_name = t(sales_agent, "name") if sales_agent is not None else None
        agent_phone = t(sales_agent, "phone") if sales_agent is not None else None

        payment_nodes = offer.findall(f"{{{NS}}}payment-type")
        payment_methods = ", ".join([p.text.strip() for p in payment_nodes if p.text])

        advantages_nodes = offer.findall(f"{{{NS}}}advantage")
        advantages = ", ".join([a.text.strip() for a in advantages_nodes if a.text])

        lift_val = t(offer, "lift")
        lift = lift_val.lower() in ("yes", "true", "1") if lift_val else False

        cur.execute(f"""
            INSERT INTO {schema}.apartments (
                internal_id, type, category, rooms, floor, floors_total,
                area, living_space, kitchen_space, price, currency,
                renovation, balcony, bathroom_unit,
                building_name, building_type, building_state,
                building_phase, building_section,
                built_year, ready_quarter, lift, parking,
                address, region, locality, sub_locality,
                description, complex_description,
                payment_methods, advantages, images,
                sales_agent_name, sales_agent_phone,
                nmarket_complex_id, nmarket_building_id,
                updated_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s,
                %s, %s, %s,
                %s, %s,
                %s, %s,
                NOW()
            )
            ON CONFLICT (internal_id) DO UPDATE SET
                type = EXCLUDED.type,
                category = EXCLUDED.category,
                rooms = EXCLUDED.rooms,
                floor = EXCLUDED.floor,
                floors_total = EXCLUDED.floors_total,
                area = EXCLUDED.area,
                living_space = EXCLUDED.living_space,
                kitchen_space = EXCLUDED.kitchen_space,
                price = EXCLUDED.price,
                currency = EXCLUDED.currency,
                renovation = EXCLUDED.renovation,
                balcony = EXCLUDED.balcony,
                bathroom_unit = EXCLUDED.bathroom_unit,
                building_name = EXCLUDED.building_name,
                building_type = EXCLUDED.building_type,
                building_state = EXCLUDED.building_state,
                building_phase = EXCLUDED.building_phase,
                building_section = EXCLUDED.building_section,
                built_year = EXCLUDED.built_year,
                ready_quarter = EXCLUDED.ready_quarter,
                lift = EXCLUDED.lift,
                parking = EXCLUDED.parking,
                address = EXCLUDED.address,
                region = EXCLUDED.region,
                locality = EXCLUDED.locality,
                sub_locality = EXCLUDED.sub_locality,
                description = EXCLUDED.description,
                complex_description = EXCLUDED.complex_description,
                payment_methods = EXCLUDED.payment_methods,
                advantages = EXCLUDED.advantages,
                images = EXCLUDED.images,
                sales_agent_name = EXCLUDED.sales_agent_name,
                sales_agent_phone = EXCLUDED.sales_agent_phone,
                nmarket_complex_id = EXCLUDED.nmarket_complex_id,
                nmarket_building_id = EXCLUDED.nmarket_building_id,
                updated_at = NOW()
            RETURNING (xmax = 0) AS is_insert
        """, (
            internal_id, t(offer, "type"), t(offer, "category"),
            ti(offer, "rooms"), ti(offer, "floor"), ti(offer, "floors-total"),
            tf(offer, "area"), tf(offer, "living-space"), tf(offer, "kitchen-space"),
            price_val, currency,
            t(offer, "renovation"), t(offer, "balcony"), t(offer, "bathroom-unit"),
            t(offer, "building-name"), t(offer, "building-type"), t(offer, "building-state"),
            t(offer, "building-phase"), t(offer, "building-section"),
            ti(offer, "built-year"), ti(offer, "ready-quarter"), lift, t(offer, "parking"),
            address, region, locality, sub_locality,
            t(offer, "description"), t(offer, "complex-description"),
            payment_methods, advantages, images,
            agent_name, agent_phone,
            t(offer, "nmarket-complex-id"), t(offer, "nmarket-building-id"),
        ))

        row = cur.fetchone()
        if row and row[0]:
            inserted += 1
        else:
            updated += 1

    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({
            "success": True,
            "total": len(offers),
            "inserted": inserted,
            "updated": updated,
        }),
    }