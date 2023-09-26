FROM node:slim

WORKDIR /app

COPY package*.json /app

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]