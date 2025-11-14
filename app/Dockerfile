FROM node:25.1.0

WORKDIR /quizzmaster
COPY package* .
RUN npm install
COPY . .
RUN npm run build

COPY env.production ./.env
ENTRYPOINT ["npm", "run", "start"]
