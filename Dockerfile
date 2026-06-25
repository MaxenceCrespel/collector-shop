FROM node:22-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build
FROM node:22-alpine
WORKDIR /app
COPY api/package*.json ./api/
RUN cd api && npm install
COPY api/ ./api/
COPY --from=build-client /app/client/build ./api/public
EXPOSE 3000
CMD ["node", "api/server.js"]