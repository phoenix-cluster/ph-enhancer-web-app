From nginx:stable-alpine

COPY dist-docker /app
COPY nginx_docker.conf  /etc/nginx/nginx.conf




