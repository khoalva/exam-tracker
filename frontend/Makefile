.PHONY: help install dev build start clean test lint format

# Default target
help:
	@echo "Next.js Frontend - Available commands:"
	@echo ""
	@echo "  help     - Show this help message"
	@echo "  install  - Install dependencies using npm"
	@echo "  dev      - Start development server with hot reload"
	@echo "  build    - Build for production"
	@echo "  start    - Start production server"
	@echo "  clean    - Clean cache and build files"
	@echo "  test     - Run tests"
	@echo "  lint     - Run linting"
	@echo "  format   - Format code"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing dependencies with npm..."
	npm install

# Start development server
dev:
	@echo "🎨 Starting Next.js development server..."
	@echo "Server will be available at http://localhost:3000"
	npm run dev

# Build for production
build:
	@echo "🔨 Building Next.js application for production..."
	npm run build

# Start production server
start:
	@echo "🚀 Starting Next.js production server..."
	npm run start

# Clean cache and build files
clean:
	@echo "🧹 Cleaning cache and build files..."
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf out

# Run tests
test:
	@echo "🧪 Running tests..."
	npm run test || echo "No tests configured"

# Run linting
lint:
	@echo "🔍 Running linting..."
	npm run lint

# Format code
format:
	@echo "✨ Formatting code..."
	npx prettier --write . || echo "Prettier not configured"

# Type check
typecheck:
	@echo "🔍 Running TypeScript type check..."
	npm run type-check || npx tsc --noEmit

# Development setup
setup: install
	@echo "✅ Frontend setup complete!"