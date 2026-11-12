import json
import uuid
from typing import List, Optional, Dict, Any
from app.database.connection import get_db

class TripRepository:
    @staticmethod
    def save_trip(trip_data: Dict[str, Any]) -> str:
        trip_id = trip_data.get("id") or str(uuid.uuid4())
        plan_json = json.dumps(trip_data, ensure_ascii=False)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO trips (
                    id, destination, origin, start_date, end_date,
                    duration_days, travellers, total_budget,
                    travel_style, preferred_transport, interests,
                    plan_json, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(id) DO UPDATE SET
                    destination = excluded.destination,
                    origin = excluded.origin,
                    start_date = excluded.start_date,
                    end_date = excluded.end_date,
                    duration_days = excluded.duration_days,
                    travellers = excluded.travellers,
                    total_budget = excluded.total_budget,
                    travel_style = excluded.travel_style,
                    preferred_transport = excluded.preferred_transport,
                    interests = excluded.interests,
                    plan_json = excluded.plan_json,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                trip_id,
                trip_data.get("destination", "Unknown"),
                trip_data.get("origin", "Unknown"),
                trip_data.get("start_date", ""),
                trip_data.get("end_date", ""),
                trip_data.get("duration_days", 1),
                trip_data.get("travellers", 1),
                trip_data.get("total_budget", 0.0),
                trip_data.get("travel_style", "Standard"),
                trip_data.get("preferred_transport", "Any"),
                json.dumps(trip_data.get("interests", [])),
                plan_json
            ))
        return trip_id

    @staticmethod
    def get_trip(trip_id: str) -> Optional[Dict[str, Any]]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT plan_json FROM trips WHERE id = ?", (trip_id,))
            row = cursor.fetchone()
            if row:
                return json.loads(row["plan_json"])
        return None

    @staticmethod
    def list_trips() -> List[Dict[str, Any]]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, destination, origin, start_date, end_date,
                       duration_days, travellers, total_budget, travel_style,
                       created_at, updated_at, plan_json
                FROM trips
                ORDER BY updated_at DESC
            """)
            rows = cursor.fetchall()
            trips = []
            for row in rows:
                try:
                    full_plan = json.loads(row["plan_json"])
                    trips.append({
                        "id": row["id"],
                        "destination": row["destination"],
                        "origin": row["origin"],
                        "start_date": row["start_date"],
                        "end_date": row["end_date"],
                        "duration_days": row["duration_days"],
                        "travellers": row["travellers"],
                        "total_budget": row["total_budget"],
                        "travel_style": row["travel_style"],
                        "total_estimated_cost": full_plan.get("budget_breakdown", {}).get("total_estimated_cost", 0),
                        "created_at": row["created_at"],
                        "updated_at": row["updated_at"],
                        "overview": full_plan.get("overview", "")
                    })
                except Exception:
                    continue
            return trips

    @staticmethod
    def delete_trip(trip_id: str) -> bool:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
            return cursor.rowcount > 0

    @staticmethod
    def add_message(trip_id: str, role: str, message: str):
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO conversation_history (trip_id, role, message) VALUES (?, ?, ?)",
                (trip_id, role, message)
            )

    @staticmethod
    def get_messages(trip_id: str) -> List[Dict[str, Any]]:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT role, message, timestamp FROM conversation_history WHERE trip_id = ? ORDER BY id ASC",
                (trip_id,)
            )
            return [dict(r) for r in cursor.fetchall()]
