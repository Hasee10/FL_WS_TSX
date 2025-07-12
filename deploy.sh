#!/bin/bash

# Falcon Laser Levelers Website Deployment Script
# This script builds and deploys the website to production

set -e  # Exit on any error

# Configuration
PROJECT_NAME="falcon-laser-levelers-website"
BUILD_DIR="dist"
DEPLOY_DIR="/var/www/falconlaserlevelers.com"
BACKUP_DIR="/var/backups/falconlaserlevelers"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✓${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root
check_permissions() {
    if [ "$EUID" -eq 0 ]; then
        error "Please don't run this script as root"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        error "Node.js version 16 or higher is required"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci --only=production
    else
        npm install --only=production
    fi
    
    success "Dependencies installed"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    if npm test; then
        success "Tests passed"
    else
        error "Tests failed"
        exit 1
    fi
}

# Build the project
build_project() {
    log "Building project..."
    
    # Clean previous build
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
    fi
    
    # Build CSS
    log "Building CSS..."
    npm run build:css
    
    # Build JavaScript
    log "Building JavaScript..."
    npm run build:js
    
    # Build images
    log "Optimizing images..."
    npm run build:images
    
    # Copy additional assets
    log "Copying assets..."
    cp -r assets/fonts "$BUILD_DIR/assets/" 2>/dev/null || true
    cp -r assets/videos "$BUILD_DIR/assets/" 2>/dev/null || true
    
    success "Project built successfully"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        # Create backup directory if it doesn't exist
        mkdir -p "$BACKUP_DIR"
        
        # Create backup
        tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" -C "$DEPLOY_DIR" .
        success "Backup created: backup_$TIMESTAMP.tar.gz"
    else
        warning "No existing deployment found, skipping backup"
    fi
}

# Deploy to server
deploy_to_server() {
    log "Deploying to server..."
    
    # Check if deploy directory exists
    if [ ! -d "$DEPLOY_DIR" ]; then
        error "Deploy directory does not exist: $DEPLOY_DIR"
        exit 1
    fi
    
    # Copy files to deployment directory
    rsync -avz --delete "$BUILD_DIR/" "$DEPLOY_DIR/"
    
    # Set proper permissions
    chmod -R 755 "$DEPLOY_DIR"
    chown -R www-data:www-data "$DEPLOY_DIR" 2>/dev/null || true
    
    success "Deployment completed"
}

# Update cache
update_cache() {
    log "Updating cache..."
    
    # Clear any application cache
    if [ -f "$DEPLOY_DIR/clear-cache.php" ]; then
        php "$DEPLOY_DIR/clear-cache.php"
    fi
    
    # Clear CDN cache if configured
    if [ -n "$CDN_PURGE_URL" ]; then
        curl -X POST "$CDN_PURGE_URL" || warning "Failed to purge CDN cache"
    fi
    
    success "Cache updated"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check if website is accessible
    if curl -f -s "https://falconlaserlevelers.com" > /dev/null; then
        success "Website is accessible"
    else
        warning "Website health check failed"
    fi
}

# Cleanup old backups
cleanup_backups() {
    log "Cleaning up old backups..."
    
    # Keep only last 10 backups
    if [ -d "$BACKUP_DIR" ]; then
        cd "$BACKUP_DIR"
        ls -t | tail -n +11 | xargs -r rm -f
        success "Old backups cleaned up"
    fi
}

# Main deployment function
main() {
    log "Starting deployment of $PROJECT_NAME"
    
    check_permissions
    check_prerequisites
    install_dependencies
    run_tests
    build_project
    create_backup
    deploy_to_server
    update_cache
    health_check
    cleanup_backups
    
    success "Deployment completed successfully!"
    log "Website is now live at https://falconlaserlevelers.com"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --build-only   Only build the project, don't deploy"
        echo "  --no-backup    Skip backup creation"
        echo "  --no-tests     Skip running tests"
        echo ""
        echo "Environment variables:"
        echo "  DEPLOY_DIR     Deployment directory (default: /var/www/falconlaserlevelers.com)"
        echo "  BACKUP_DIR     Backup directory (default: /var/backups/falconlaserlevelers)"
        echo "  CDN_PURGE_URL  CDN cache purge URL"
        exit 0
        ;;
    --build-only)
        log "Build-only mode"
        check_prerequisites
        install_dependencies
        build_project
        success "Build completed"
        exit 0
        ;;
    --no-backup)
        log "Skipping backup creation"
        SKIP_BACKUP=true
        ;;
    --no-tests)
        log "Skipping tests"
        SKIP_TESTS=true
        ;;
esac

# Run main deployment
main 