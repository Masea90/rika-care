#!/bin/bash

# RIKA Care - Production Deployment Script
# Run this to deploy to production

echo "🚀 RIKA Care - Production Deployment"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found"
    echo "Please run this script from the RIKA project root directory"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        git add .
        git commit -m "$commit_message"
        echo "✅ Changes committed"
    else
        echo "⚠️  Deploying without committing changes"
    fi
else
    echo "✅ No uncommitted changes"
fi

echo ""
echo "🔄 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub"
    echo ""
    echo "🎉 Deployment initiated!"
    echo ""
    echo "📍 Next steps:"
    echo "  1. Visit https://dashboard.render.com to monitor deployment"
    echo "  2. Wait 3-5 minutes for deployment to complete"
    echo "  3. Test your app at https://rika-care.onrender.com"
    echo ""
    echo "📊 Check deployment status:"
    echo "  https://dashboard.render.com/web/rika-care"
    echo ""
    echo "🔍 View logs:"
    echo "  https://dashboard.render.com/web/rika-care/logs"
else
    echo "❌ Failed to push to GitHub"
    echo "Please check your git configuration and try again"
    exit 1
fi
