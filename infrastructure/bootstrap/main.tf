# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Create a resource group for Terraform state
resource "azurerm_resource_group" "terraform_state" {
  name     = "terraform-state-rg"
  location = "westeurope"
}

# Create a storage account for Terraform state
resource "azurerm_storage_account" "terraform_state" {
  name                     = "knowledgeboxstate"
  resource_group_name      = azurerm_resource_group.terraform_state.name
  location                 = azurerm_resource_group.terraform_state.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Create a container for Terraform state
resource "azurerm_storage_container" "terraform_state" {
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.terraform_state.name
  container_access_type = "private"
}

# Output storage account access key
output "storage_account_access_key" {
  value     = azurerm_storage_account.terraform_state.primary_access_key
  sensitive = true
} 