import json
import logging
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

class GroqLLMService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.client = None
        self.model = "llama-3.3-70b-versatile"
        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")

    def is_available(self) -> bool:
        return self.client is not None and bool(self.api_key)

    def generate_json(self, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> Optional[Dict[str, Any]]:
        """Call Groq LLM with JSON response format."""
        if not self.is_available():
            return None
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt + "\nYou MUST return valid JSON ONLY. No markdown formatting outside the JSON block."},
                    {"role": "user", "content": user_prompt}
                ],
                model=self.model,
                temperature=temperature,
                response_format={"type": "json_object"}
            )
            raw_content = chat_completion.choices[0].message.content
            return json.loads(raw_content)
        except Exception as e:
            logger.error(f"Groq generation error: {e}")
            return None

    def refine_plan_prompt(self, current_plan_json: str, user_instruction: str) -> Optional[Dict[str, Any]]:
        """Refine an existing plan according to follow-up instruction."""
        if not self.is_available():
            return None
            
        system_prompt = (
            "You are TravelTwin AI Refinement Agent. "
            "You receive an existing travel plan JSON and a user modification request "
            "(e.g. 'make it cheaper', 'replace bus with train', 'add more nature spots', 'keep budget under 20000'). "
            "Modify only the relevant sections (transport, accommodation, itinerary, or budget breakdown) "
            "while maintaining total consistency and returning the complete updated plan as a single JSON object matching the original structure."
        )
        user_prompt = f"Existing Plan:\n{current_plan_json}\n\nUser Instruction:\n{user_instruction}"
        return self.generate_json(system_prompt, user_prompt, temperature=0.2)

