#########################################################################
# File Name: run_container.sh
# Author: baimz
# mail: baimingze@gmail.com
# Created Time: Thu 08 Aug 2019 02:13:55 PM CST
#########################################################################
#!/bin/bash
docker container kill  enhancer_web_app_container

#docker container rm enhancer_web_app_container

docker container run \
  -d \
  --rm \
  --name enhancer_web_app_container \
  -p 4202:4200 \
  phoenixenhancer/enhancer-web-app
