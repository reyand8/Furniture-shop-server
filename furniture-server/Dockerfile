FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]
