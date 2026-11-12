from fastapi import APIRouter
from app.config import settings
from app.services.groq_service import GroqLLMService
from app.services.tavily_service import TavilyResearchService

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint displaying system status and integrated external services."""
    groq_ready = GroqLLMService().is_available()
    tavily_ready = TavilyResearchService().client is not None
    
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "integrations": {
            "groq_api": "connected" if groq_ready else "fallback_mode (add GROQ_API_KEY to .env for live LLM)",
            "tavily_api": "connected" if tavily_ready else "fallback_mode (add TAVILY_API_KEY to .env for live search)",
            "open_meteo_weather": "connected (live open public API)",
            "sqlite_database": "ready"
        }
    }
