FROM node:22-alpine AS build-client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build
FROM node:22-alpine
WORKDIR /app
COPY api/package*.json ./api/
RUN cd api && npm install && \
    npm cache clean --force && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
COPY api/ ./api/
COPY --from=build-client /app/client/build ./api/public
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/articles || exit 1
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "api/server.js"]