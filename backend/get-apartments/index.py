import os
import json
import psycopg2
import psycopg2.extras


def handler(event: dict, context) -> dict:
    """Возвращает список квартир из БД с фильтрацией и пагинацией"""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    params = event.get("queryStringParameters") or {}

    # Если передан id — возвращаем один объект
    apt_id = params.get("id")
    if apt_id:
        schema = os.environ.get("MAIN_DB_SCHEMA", "public")
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"""
            SELECT id, internal_id, rooms, floor, floors_total,
                area, living_space, kitchen_space,
                price, currency, renovation, balcony,
                building_name, building_state, building_phase, building_section,
                built_year, ready_quarter, lift, parking,
                address, region, locality,
                description, images,
                payment_methods, advantages,
                sales_agent_name, sales_agent_phone,
                nmarket_complex_id, updated_at
            FROM {schema}.apartments WHERE id = {int(apt_id)}
        """)
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return {"statusCode": 404, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"error": "not found"})}
        item = dict(row)
        if item.get("updated_at"):
            item["updated_at"] = item["updated_at"].isoformat()
        for f in ("area", "living_space", "kitchen_space"):
            if item.get(f):
                item[f] = float(item[f])
        return {"statusCode": 200, "headers": {"Access-Control-Allow-Origin": "*"}, "body": json.dumps({"apartment": item}, ensure_ascii=False)}

    rooms = params.get("rooms")
    min_price = params.get("min_price")
    max_price = params.get("max_price")
    min_area = params.get("min_area")
    max_area = params.get("max_area")
    building_name = params.get("building_name")
    building_state = params.get("building_state")
    page = int(params.get("page", 1))
    limit = min(int(params.get("limit", 20)), 100)
    offset = (page - 1) * limit

    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    where = []
    args = []

    if rooms:
        where.append(f"rooms = {int(rooms)}")
    if min_price:
        where.append(f"price >= {int(min_price)}")
    if max_price:
        where.append(f"price <= {int(max_price)}")
    if min_area:
        where.append(f"area >= {float(min_area)}")
    if max_area:
        where.append(f"area <= {float(max_area)}")
    if building_name:
        safe = building_name.replace("'", "''")
        where.append(f"building_name ILIKE '%{safe}%'")
    if building_state:
        safe = building_state.replace("'", "''")
        where.append(f"building_state = '{safe}'")

    where_clause = "WHERE " + " AND ".join(where) if where else ""

    cur.execute(f"SELECT COUNT(*) as total FROM {schema}.apartments {where_clause}")
    total = cur.fetchone()["total"]

    cur.execute(f"""
        SELECT
            id, internal_id, rooms, floor, floors_total,
            area, living_space, kitchen_space,
            price, currency, renovation, balcony,
            building_name, building_state, building_phase, building_section,
            built_year, ready_quarter, lift, parking,
            address, region, locality,
            description, images,
            payment_methods, advantages,
            sales_agent_name, sales_agent_phone,
            nmarket_complex_id, updated_at
        FROM {schema}.apartments
        {where_clause}
        ORDER BY price ASC NULLS LAST
        LIMIT {limit} OFFSET {offset}
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    apartments = []
    for row in rows:
        item = dict(row)
        if item.get("updated_at"):
            item["updated_at"] = item["updated_at"].isoformat()
        if item.get("area"):
            item["area"] = float(item["area"])
        if item.get("living_space"):
            item["living_space"] = float(item["living_space"])
        if item.get("kitchen_space"):
            item["kitchen_space"] = float(item["kitchen_space"])
        apartments.append(item)

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({
            "apartments": apartments,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit,
        }, ensure_ascii=False),
    }