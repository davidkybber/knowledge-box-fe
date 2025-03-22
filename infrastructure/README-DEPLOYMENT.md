# Deploying to Azure Static Web App

This guide explains how to set up the GitHub Actions workflow to deploy your Angular application to Azure Static Web App.

## Setup Steps

1. **Create a GitHub Repository Secret**

   You need to create a repository secret named `AZURE_STATIC_WEB_APP_API_TOKEN` with the deployment token from your Azure Static Web App:

   a. In the Azure Portal, navigate to your Static Web App
   b. Go to "Overview"
   c. Click on "Manage deployment token"
   d. Copy the token
   e. In your GitHub repository, go to Settings > Secrets and variables > Actions
   f. Create a new repository secret named `AZURE_STATIC_WEB_APP_API_TOKEN` with the token value

2. **Workflow File**

   The workflow file `.github/workflows/azure-static-web-app.yml` is already set up to:
   
   - Trigger on pushes to the main branch
   - Build the Angular application
   - Deploy to Azure Static Web App
   - Create preview environments for pull requests

3. **First Deployment**

   Simply push code to your main branch to trigger the deployment:

   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

## How It Works

- **Main Branch**: Changes pushed to the main branch are automatically deployed to production
- **Pull Requests**: A preview environment is created for each pull request
- **Closed PRs**: Preview environments are automatically cleaned up when PRs are closed

## Troubleshooting

If your deployment fails, check the following:

1. Verify the `AZURE_STATIC_WEB_APP_API_TOKEN` secret is correctly set
2. Ensure the build output directory in the workflow file matches your Angular configuration
3. Check GitHub Actions logs for specific error messages 