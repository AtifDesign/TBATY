#!/bin/bash

# Azure deployment script
az login
az account set --subscription YOUR_SUBSCRIPTION_ID

# Create resource group if it doesn't exist
az group create --name bigapprenticeshipthankeyou-rg --location ukwest

# Create storage account for static content
az storage account create \
    --name bigappthankeyou \
    --resource-group bigapprenticeshipthankeyou-rg \
    --location ukwest \
    --sku Standard_LRS \
    --kind StorageV2

# Enable static website hosting
az storage blob service-properties update \
    --account-name bigappthankeyou \
    --static-website \
    --index-document index.html \
    --404-document error.html

# Deploy files
az storage blob upload-batch \
    --account-name bigappthankeyou \
    --source . \
    --destination '$web' 