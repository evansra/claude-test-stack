FROM node:22-alpine
WORKDIR /app
COPY package.json server.js ./
RUN npm install --omit=dev --no-audit --no-fund
USER node
EXPOSE 3000
CMD ["node", "server.js"]
