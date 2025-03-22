# How to Get and Use the Azure Static Web App API Token

This guide explains how to extract the Azure Static Web App API token (deployment token) from your Terraform output and configure it for GitHub Actions.

## Getting the API Token After Terraform Apply

After running `terraform apply` to create your infrastructure, Terraform will output several values including the API token (marked as sensitive).

### Method 1: Using the GitHub CLI (Recommended)

If you have the GitHub CLI installed, you can run the command that Terraform outputs to automatically set the GitHub secret:

```bash
# This command will be shown in the Terraform output
# Example: gh secret set AZURE_STATIC_WEB_APP_API_TOKEN --body "$(terraform output -raw static_web_app_api_key)"
```

Simply copy and run the command shown in the `github_token_command` output. This will:
1. Extract the API token from the Terraform state
2. Set it as a GitHub repository secret named `AZURE_STATIC_WEB_APP_API_TOKEN`

### Method 2: Manual Extraction

If you prefer to manually extract the token:

```bash
# Get the API token
terraform output -raw static_web_app_api_key
```

This will output the API token value. You can then:

1. Copy this value
2. Go to your GitHub repository
3. Navigate to Settings > Secrets and variables > Actions
4. Create a new repository secret named `AZURE_STATIC_WEB_APP_API_TOKEN`
5. Paste the value and save

## Important Security Notes

- The API token is sensitive information and should be treated as a secret
- Never commit the token to your repository
- If you need to regenerate the token, you can do so in the Azure Portal
- Terraform will store the token in its state file, so ensure your state file is properly secured

## Using the Token in GitHub Actions

Your GitHub Actions workflow is already configured to use this token through the `AZURE_STATIC_WEB_APP_API_TOKEN` secret reference.

No further configuration is needed in the workflow file itself. 