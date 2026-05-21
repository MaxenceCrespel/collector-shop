# Étape 1 : Build du Frontend React
FROM node:20-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Étape 2 : Setup du Backend Node
FROM node:20-alpine
WORKDIR /app
COPY api/package*.json ./api/
RUN cd api && npm install
COPY api/ ./api/

# On récupère le build du front pour que Node puisse le servir
COPY --from=build-client /app/client/build ./api/public

EXPOSE 3000
# On lance le serveur depuis le dossier api
CMD ["node", "api/server.js"]