FROM node:18 as builder
# set the working direction
WORKDIR /app
# install app dependencies
COPY package.json ./
#
RUN yarn  
# add app
COPY . ./
# build application
RUN yarn build


FROM nginx:stable-alpine AS runner
#copy build folder to  nginx 
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/

EXPOSE 7001

#run nginx
CMD ["nginx", "-g", "daemon off;"]
