FROM nginx:1.21.3-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY lazychat-backend.prod.conf /etc/nginx/conf.d
COPY lazychat-frontend.prod.conf /etc/nginx/conf.d
