FROM node:18-alpine
WORKDIR /usr/app
COPY ./ .
RUN npm install && npm install typescript --save-dev
RUN npx tsc -b
CMD [ "node","app.js" ]
EXPOSE 3000