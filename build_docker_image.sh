#########################################################################
# File Name: build_docker.sh
# Author: baimz
# mail: baimingze@gmail.com
# Created Time: Thu 08 Aug 2019 02:12:45 PM CST
#########################################################################
#!/bin/bash
docker container kill  enhancer_web_app_container

docker container rm enhancer_web_app_container

docker image rm phoenixenhancer/enhancer-web-app

docker build  -t  phoenixenhancer/enhancer-web-app .
