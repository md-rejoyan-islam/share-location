FROM --platform=arm64 node:20-alpine3.19 

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"] 

EXPOSE 3000