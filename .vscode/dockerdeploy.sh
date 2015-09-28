#!/bin/bash
# Parameters:
# $1 - Azure subscription Id
# $2 - Full path to the Azure publish settings file
# $3 - Location where VM should be created (default = Central US) 

SUBSCRIPTION="{INSERT SUBSCRIPTION ID HERE}"

# this needs to be in the root folder for now...
PUBLISH_SETTINGS_FILE="azure.publishsettings"
LOCATION="Central US"
VM_NAME="AzureVM$RANDOM"
	
docker-machine create -d azure --azure-subscription-id="$SUBSCRIPTION" --azure-publish-settings-file "$PUBLISH_SETTINGS_FILE" --azure-location "$LOCATION" $VM_NAME
	
# switch to the created machine 
echo "Switching to $VM_NAME"
eval $(docker-machine env $VM_NAME)
	
# run the prod compose file
docker-compose --file ./DemoApp/ProdDocker-compose.yml up -d
	
# add the http endpoint.
azure vm endpoint create -o tcp -n HTTP $VM_NAME 80 80 
	
# open the deployed site.
open "http://$(docker-machine ip default)"