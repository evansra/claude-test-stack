# D125 manual test (EVA New App, which builds from the repo root): the lobby test service as one app.
FROM node:22-alpine
WORKDIR /app
COPY services/lobby/server.js .
ENV SERVICE_NAME=envapp PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.js"]
