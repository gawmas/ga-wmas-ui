FROM node:18.19-alpine3.19
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --save --legacy-peer-deps
CMD ["npm", "run", "network"]
