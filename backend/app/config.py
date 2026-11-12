import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "TravelTwin AI"
    APP_VERSION: str = "1.0.0"
    TAGLINE: str = "Your journey, intelligently planned."
    
    # API Keys
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    
    # Server & Port
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    
    # CORS (as string, parsed via property)
    CORS_ORIGINS_STR: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://traveltwin.onrender.com"
    
    # Database
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "traveltwin.db")

    @property
    def cors_origins(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS", self.CORS_ORIGINS_STR)
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

settings = Settings()
