FROM node:16.11.1

WORKDIR /app
COPY package*.json ./

RUN yarn
COPY . .

CMD ["yarn", "start"]

EXPOSE 80