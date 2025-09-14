.PHONY: help install dev start seed clean test lint format

# Default target
help:
	@echo "FastAPI Backend - Available commands:"
	@echo ""
	@echo "  help     - Show this help message"
	@echo "  install  - Install dependencies using Poetry"
	@echo "  dev      - Start development server with hot reload"
	@echo "  start    - Start production server"
	@echo "  seed     - Create sample data"
	@echo "  clean    - Clean cache and temporary files"
	@echo "  test     - Run tests"
	@echo "  lint     - Run linting"
	@echo "  format   - Format code"
	@echo "  shell    - Activate Poetry virtual environment"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing dependencies with Poetry..."
	poetry install --no-root

# Start development server
dev:
	@echo "🚀 Starting FastAPI development server..."
	@echo "Server will be available at http://127.0.0.1:8000"
	@echo "API Documentation: http://127.0.0.1:8000/docs"
	poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start production server
start:
	@echo "🚀 Starting FastAPI production server..."
	poetry run uvicorn main:app --host 0.0.0.0 --port 8000

# Create sample data
seed:
	@echo "🌱 Creating sample data..."
	poetry run python seed_data.py

# Clean cache and temporary files
clean:
	@echo "🧹 Cleaning cache and temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true

# Run tests
test:
	@echo "🧪 Running tests..."
	poetry run pytest

# Run linting
lint:
	@echo "🔍 Running linting..."
	poetry run flake8 . || echo "flake8 not installed, install with: poetry add --group dev flake8"

# Format code
format:
	@echo "✨ Formatting code..."
	poetry run black . || echo "black not installed, install with: poetry add --group dev black"
	poetry run isort . || echo "isort not installed, install with: poetry add --group dev isort"

# Activate Poetry shell
shell:
	@echo "🐚 Activating Poetry virtual environment..."
	poetry shell

# Quick setup (install + seed)
setup: install seed
	@echo "✅ Setup complete!"

# Development setup (install + seed + start dev server)
dev-setup: install seed dev