#!/bin/bash
source .vscode/dockersettings.cfg

# Checks if docker-machine is ready by running docker-machine -v and sets 
# IS_DOCKER_READY variable to true or false.
function isDockerMachineReady()
{
	IS_DOCKER_READY=false
	docker-machine -v
	
	# $? has the exit code from the previous command  
	if [ $? -ne 0 ]; then
		IS_DOCKER_READY=false
	else 
		IS_DOCKER_READY=true
	fi
}

# Initializes Docker machine by calling docker-machine env and passing
# in the machine name to use. 
function initializeDocker()
{
	local machineName=$1
	echo "Setting active Docker machine to '${machineName}'." 
	eval $(docker-machine env ${machineName} --shell=bash) 2>/dev/null
}

# Lists all docker containers.
function listContainers()
{
	echo "Listing Docker containers"
	docker ps -a
}

# Lists all docker images.
function listImages()
{
	echo "Listing Docker images"
	docker images
}

# Cleans up all dangling images and exited containers. 
function cleanupContainersAndImages()
{
	echo "Cleaning up dangling images and exited containers"
	docker rm $(docker ps --filter status=exited -q) 2>/dev/null
	docker rmi $(docker images --filter dangling=true) 2>/dev/null
}

# Stops all running containers and deletes them as well as all images.
function deleteContainersAndImages()
{
	echo "Stopping/deleting all containers and images"
	docker stop $(docker ps -a -q 2>/dev/null) 2>/dev/null
	docker rm $(docker ps -q -a 2>/dev/null) 2>/dev/null
	docker rmi $(docker images -q 2>/dev/null) -f 2>/dev/null
}

function buildImage()
{
	echo "Building image '${3}' from '${1}' (context: '${2}')."
	docker build --file ${1} --tag ${3} ${2}
}

# Runs the provided command.
function runCommand()
{
	if [ $1 = "listContainers" ]; then
		listContainers
	elif [ $1 = "listImages" ]; then
		listImages
	elif [ $1 = "cleanupContainersAndImages" ]; then
		cleanupContainersAndImages
	elif [ $1 = "deleteContainersAndImages" ]; then 
		deleteContainersAndImages
	elif [ $1 = "buildImage" ]; then
		buildImage ${dockerFile} ${dockerFileContext} ${imageNamePattern}
	elif [ $1 = "compose" ]; then
		echo "Running compose"
		docker-compose --file ./DemoApp/DevDocker-compose.yml up -d
		open "http://$(docker-machine ip default)"
	elif [ $1 = "deployProd" ]; then
		./dockerdeploy.sh
	else
		echo "Command '${1}' is not supported yet :(" 
	fi
}

function showUsage()
{
	echo "Please provide parameters to the script."
}

########## MAIN ########## 

if [ $# -eq 0 ]; then
	showUsage
	exit 1;
fi 

# Check if Docker is ready 
isDockerMachineReady

if [ $IS_DOCKER_READY ]; then	 
	# Check if default machine is set, if its not, use the default one. 
	activeMachineName=$(docker-machine active)
	if [ $? -ne 0 ]; then
		echo "Active Docker machine is not set."
		# active machine is not set; set it to default. 
		initializeDocker ${dockerHostName}
	else
		echo "Using Docker machine: '${activeMachineName}'."
	fi
else
	echo "Oops. Looks like something is wrong with docker-machine. Is Docker installed?"
	exit 1
fi

# Run the docker command.
runCommand $1

echo "Done."