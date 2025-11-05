@echo off
echo ========================================
echo   VocaCare LiveKit AI Agent Launcher
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Install dependencies
echo Checking dependencies...
pip install -q -r requirements.txt
echo Dependencies installed!
echo.

REM Check for .env file
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file with your API keys.
    echo See .env.example for reference.
    pause
    exit /b 1
)

echo ========================================
echo   Starting LiveKit AI Agent...
echo ========================================
echo.
echo Agent will wait for incoming calls...
echo Press Ctrl+C to stop
echo.

python livekit_agent.py dev

pause
