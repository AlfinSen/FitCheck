#!/bin/bash

# Kill all background processes on exit
trap "kill 0" EXIT

echo "------------------------------------------------"
echo "   FitCheck: Unified Python Backend Launch    "
echo "------------------------------------------------"

# 1. Start Python Backend (Handling everything)
echo "[1/2] Starting Python Unified Backend (Port 5001)..."
cd backend
if ! python3 -c "import flask, gradio_client, dotenv" &> /dev/null; then
    echo "Installing Python dependencies..."
    pip3 install -r requirements.txt
fi
python3 vton_server.py &
VTON_PID=$!

# 2. Start Frontend
echo "[2/2] Starting Frontend (Port 5174)..."
cd ../frontend
npm run dev &
FRONT_PID=$!

echo "------------------------------------------------"
echo "Unified Backend: http://localhost:5001"
echo "Frontend: http://localhost:5174"
echo "------------------------------------------------"

# Wait for all background processes
wait
