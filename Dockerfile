# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- serve stage (stdlib Node server, no runtime deps) ---
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./
ENV PORT=8080
ENV DATA_FILE=/data/progress.json
VOLUME /data
EXPOSE 8080
HEALTHCHECK CMD wget -q --spider http://localhost:8080/ || exit 1
CMD ["node", "server.js"]
