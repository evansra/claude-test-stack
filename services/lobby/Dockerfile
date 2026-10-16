FROM node:22-alpine
WORKDIR /app
COPY server.js .
ENV SERVICE_NAME=lobby PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.js"]
