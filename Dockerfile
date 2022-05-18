FROM node:current-alpine

# copy package.json over
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 4000
CMD ["npm", "start"]