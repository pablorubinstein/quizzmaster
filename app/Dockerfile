FROM node:25.1.0

WORKDIR /quizzmaster
COPY . .
RUN npm install && \
    npm run build

COPY env ./.env
ENTRYPOINT ["npm", "run", "start"]
