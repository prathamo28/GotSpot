#!/bin/bash

# GotSpot Branch Setup Script
# This script creates the proper branch structure for CI/CD

set -e

echo "🌳 Setting up GotSpot branch structure..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run 'git init' first."
    exit 1
fi

# Create branches
echo "📝 Creating branches..."

# Create dev branch
git checkout -b dev 2>/dev/null || git checkout dev
echo "✅ Created/checked out dev branch"

# Create uat branch
git checkout -b uat 2>/dev/null || git checkout uat
echo "✅ Created/checked out uat branch"

# Create pre-prod branch
git checkout -b pre-prod 2>/dev/null || git checkout pre-prod
echo "✅ Created/checked out pre-prod branch"

# Return to main branch
git checkout main 2>/dev/null || git checkout -b main
echo "✅ Created/checked out main branch"

# Set up branch protection rules (if GitHub CLI is available)
if command -v gh &> /dev/null; then
    echo "🔒 Setting up branch protection rules..."
    
    # Protect main branch
    gh api repos/:owner/:repo/branches/main/protection \
        --method PUT \
        --field required_status_checks='{"strict":true,"contexts":["security-scan","build-and-test"]}' \
        --field enforce_admins=true \
        --field required_pull_request_reviews='{"required_approving_review_count":2}' \
        --field restrictions=null \
        --field allow_force_pushes=false \
        --field allow_deletions=false || echo "⚠️ Could not set up branch protection for main"
    
    # Protect pre-prod branch
    gh api repos/:owner/:repo/branches/pre-prod/protection \
        --method PUT \
        --field required_status_checks='{"strict":true,"contexts":["security-scan","build-and-test"]}' \
        --field enforce_admins=false \
        --field required_pull_request_reviews='{"required_approving_review_count":1}' \
        --field restrictions=null \
        --field allow_force_pushes=false \
        --field allow_deletions=false || echo "⚠️ Could not set up branch protection for pre-prod"
    
    echo "✅ Branch protection rules set up"
else
    echo "⚠️ GitHub CLI not found. Please set up branch protection rules manually in GitHub."
fi

# Create initial commit if needed
if [ -z "$(git log --oneline -1 2>/dev/null)" ]; then
    echo "📝 Creating initial commit..."
    git add .
    git commit -m "Initial commit: GotSpot project setup"
    echo "✅ Initial commit created"
fi

# Push all branches
echo "🚀 Pushing branches to remote..."
git push -u origin main
git push -u origin dev
git push -u origin uat
git push -u origin pre-prod
echo "✅ All branches pushed to remote"

echo ""
echo "🎉 Branch structure setup complete!"
echo ""
echo "📋 Branch structure:"
echo "   main (production) ← pre-prod ← uat ← dev"
echo ""
echo "🔄 Development workflow:"
echo "   1. Work on feature branches from dev"
echo "   2. Merge to dev for development testing"
echo "   3. Merge dev → uat for UAT testing"
echo "   4. Merge uat → pre-prod for pre-production testing"
echo "   5. Merge pre-prod → main for production deployment"
echo ""
echo "🛡️ Security scanning:"
echo "   - dev: Basic security scans"
echo "   - uat: Comprehensive security scans"
echo "   - pre-prod: Production-level security scans"
echo "   - main: Critical security scans only"
echo ""
echo "💡 Next steps:"
echo "   1. Set up GitHub secrets (GCP_SA_KEY, SNYK_TOKEN, etc.)"
echo "   2. Start developing on feature branches"
echo "   3. Monitor security reports in GitHub Actions"
echo ""
echo "Happy coding! 🚀"
