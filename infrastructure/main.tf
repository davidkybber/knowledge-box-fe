# Create a resource group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# Create a Static Web App (using the new resource)
resource "azurerm_static_web_app" "web" {
  name                = var.static_web_app_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  tags                = var.tags
} 