FROM node:lts-alpine

# WORKDIR /usr/src/app
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY .env ./
COPY ./index.js ./
RUN npm ci
RUN npm run db:migrate

# CMD ["npm","start"]
CMD npm start
