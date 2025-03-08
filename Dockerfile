FROM node:18.19-alpine3.19
WORKDIR /usr/gawmas/src/app
COPY . /usr/gawmas/src/app
RUN npm install --save --legacy-peer-deps
CMD ["npm", "run", "network"]
