FROM node:22-alpine
WORKDIR /app
COPY server.js .
ENV SERVICE_NAME=world PORT=7000
USER node
EXPOSE 7000
CMD ["node", "server.js"]
