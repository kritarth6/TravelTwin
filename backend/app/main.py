import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.connection import init_db
from app.api.routes.trips import router as trips_router
from app.api.routes.health import router as health_router

# Initialize SQLite database
init_db()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Intelligent AI-Powered Multi-Agent Travel Planning Platform"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins if not settings.DEBUG else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routes
app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(trips_router, prefix="/api/trips", tags=["Trips"])

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": settings.TAGLINE,
        "docs_url": "/docs",
        "api_health": "/api/health"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", settings.PORT))
    uvicorn.run("app.main:app", host=settings.HOST, port=port, reload=settings.DEBUG)
