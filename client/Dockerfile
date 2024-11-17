FROM  node:20-alpine3.19 

WORKDIR /client

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "run", "dev"] 

EXPOSE 3000