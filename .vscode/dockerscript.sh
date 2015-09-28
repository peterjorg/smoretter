#!/bin/bash
echo -e "${GREEN}Initializing Docker${NC}"
eval $(docker-machine env default --shell=bash)
echo -e "${GREEN}Docker initialized.${NC}"

if [ $1 = "listContainers" ]; then
	echo "Listing Docker containers"
	docker ps -a  
elif [ $1 = "listImages" ]; then
	echo "Listing Docker images"
	docker images
elif [ $1 = "deleteContainers" ]; then
	echo "Deleting all containers"
	docker stop $(docker ps -a -q)
	docker rm $(docker ps -a -q)
elif [ $1 = "compose" ]; then
	echo "Running compose"
	docker-compose --file ./DemoApp/DevDocker-compose.yml up -d
	open "http://$(docker-machine ip default)"
elif [ $1 = "deployProd" ]; then
	./dockerdeploy.sh
else
	echo "Not supported yet :(" 
fi

echo "Done."