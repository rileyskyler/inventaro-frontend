# stage: 1
FROM node:10 as react-build
WORKDIR /app
COPY . ./
RUN npm install
RUN npm run build

# stage: 2
FROM nginx:alpine
COPY — from=react-build /app/build /var/www/inventaro.io/html/
EXPOSE 80
CMD [“nginx”, “-g”, “daemon off;”]