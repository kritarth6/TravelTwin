import sqlite3
import json
import os
from contextlib import contextmanager
from app.config import settings

DB_FILE = os.path.abspath(settings.DATABASE_PATH)

def init_db():
    """Initialize database tables for saved trips, logs, and preferences."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        
        # Saved trips table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trips (
                id TEXT PRIMARY KEY,
                destination TEXT NOT NULL,
                origin TEXT NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                duration_days INTEGER NOT NULL,
                travellers INTEGER NOT NULL,
                total_budget REAL NOT NULL,
                travel_style TEXT,
                preferred_transport TEXT,
                interests TEXT,
                plan_json TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Refinement conversation history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                trip_id TEXT NOT NULL,
                role TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()

@contextmanager
def get_db():
    """Context manager for SQLite connections with row dict factory."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

