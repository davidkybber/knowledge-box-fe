variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "knowledge-box-rg"
}

variable "location" {
  description = "Azure region to deploy resources"
  type        = string
  default     = "westeurope"
}

variable "static_web_app_name" {
  description = "Name of the Static Web App"
  type        = string
  default     = "knowledge-box-app"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    environment = "production"
    project     = "knowledge-box"
  }
} 