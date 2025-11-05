"""
VocaCare LiveKit AI Agent
Patient Registration Voice Assistant
"""

import asyncio
import logging
import json
from datetime import datetime
from typing import Annotated
from dotenv import load_dotenv
import os

load_dotenv()

from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents import voice
from livekit.plugins import google, deepgram, silero

# Import our database
from database import patient_registrations

# Configure logging
logging.basicConfig(level=logging.DEBUG)  # More verbose logging
logger = logging.getLogger(__name__)


async def entrypoint(ctx: JobContext):
    """Main entry point for the LiveKit agent"""
    
    # Patient data storage
    conversation_id = f"livekit_{ctx.room.name}_{int(datetime.now().timestamp())}"
    transcript = []
    
    logger.info(f"🎤 Starting patient registration session: {conversation_id}")

    # System instructions - tell the agent to greet first
    initial_instructions = """You are a friendly and professional medical receptionist for VocaCare hospital. 

IMPORTANT: When you first connect with a patient, immediately greet them warmly and introduce yourself. Say something like "Hello! Welcome to VocaCare hospital. I'm your AI assistant here to help with your registration today. May I have your full name, please?"

Your job is to collect patient registration information in a conversational manner. 
Be empathetic, clear, and concise.

Collect the following information in order:
1. Patient's full name
2. Age
3. Gender (Male/Female/Other)
4. Contact number
5. Address
6. Reason for visit / Main complaint
7. Preferred doctor (if any)
8. Previous medical history (if any)
9. Emergency contact name and number
10. Appointment preference (date and time)

After collecting all information, summarize it back to the patient for confirmation.
Be warm and reassuring. Keep responses brief - 1-2 sentences each.
Always respond to greetings and maintain a professional yet friendly tone."""

    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    
    # Create the voice agent
    agent = voice.Agent(
        instructions=initial_instructions,
    )

    # Create agent session with Gemini for LLM and Deepgram for TTS
    session = voice.AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(model="nova-2"),
        llm=google.LLM(model="gemini-2.0-flash-exp"),
        tts=deepgram.TTS(model="aura-asteria-en"),  # Deepgram TTS
    )

    # Start the session
    await session.start(room=ctx.room, agent=agent)
    
    logger.info("🤖 Agent started with Gemini 2.0 Flash!")
    logger.info("💬 Waiting for patient to speak first...")


if __name__ == "__main__":
    # Run the LiveKit agent
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )
