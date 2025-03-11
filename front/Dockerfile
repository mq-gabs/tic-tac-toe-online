FROM node:22.14.0

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build


FROM nginx:1.27.4

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html