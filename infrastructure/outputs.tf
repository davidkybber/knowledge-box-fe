output "static_web_app_name" {
  description = "The name of the Static Web App"
  value       = azurerm_static_web_app.web.name
}

output "static_web_app_url" {
  description = "The default host name of the Static Web App"
  value       = azurerm_static_web_app.web.default_host_name
}

output "static_web_app_api_key" {
  description = "The API key for deployments (this is the AZURE_STATIC_WEB_APP_API_TOKEN needed for GitHub Actions)"
  value       = azurerm_static_web_app.web.api_key
  sensitive   = true
}

output "github_token_command" {
  description = "Command to set the AZURE_STATIC_WEB_APP_API_TOKEN as a GitHub secret"
  value       = "gh secret set AZURE_STATIC_WEB_APP_API_TOKEN --body \"$(terraform output -raw static_web_app_api_key)\""
  sensitive   = false
} 