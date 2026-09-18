FROM node:22-alpine AS build
WORKDIR /app

COPY src/frontend/cdb-frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY src/frontend/cdb-frontend/ ./

RUN npm run build --configuration=production

FROM nginx:alpine AS final

COPY --from=build /app/dist/cdb-frontend/browser /usr/share/nginx/html

COPY src/frontend/cdb-frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]