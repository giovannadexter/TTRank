#!/bin/bash

# TTRank Setup Script
echo "🏓 Setting up TTRank - Table Tennis Tournament Management System"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Backend setup
echo "📦 Setting up backend..."
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template. Please edit it with your settings."
fi

echo "Setting up database..."
python3 manage.py makemigrations
python3 manage.py migrate

echo "Creating superuser..."
echo "Please create a superuser account:"
python3 manage.py createsuperuser

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend/ttrank-frontend

echo "Installing Node.js dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "Backend:  cd ttrank && python3 manage.py runserver"
echo "Frontend: cd frontend/ttrank-frontend && npm run dev"
echo ""
echo "📱 Access URLs:"
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000/api"
echo "Admin Panel: http://localhost:8000/admin"