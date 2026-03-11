#!/bin/bash

# Kill all background processes on exit
trap "kill 0" EXIT

echo "Starting FitCheck Application..."

# Start Backend
echo "Starting Backend on port 5001..."
cd backend && npm run dev &

# Start Frontend
echo "Starting Frontend on port 5173..."
cd ../frontend && npm run dev &

# Wait for all background processes
wait
