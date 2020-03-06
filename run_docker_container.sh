#########################################################################
# File Name: run.sh
# Created Time: Thu 08 Aug 2019 11:28:00 AM CST
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

#copy the modified config file into container
docker cp  src/assets/config/config-docker.json enhancer_web_app_container:/app/assets/config/.

#reload nginx service 
docker exec enhancer_web_app_container sh -c "nginx -s reload"
