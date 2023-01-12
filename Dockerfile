FROM node:18-alpine
WORKDIR /src/
COPY . /src/
RUN npm install
RUN npx tsc -b
CMD ["node", "app.js"]
EXPOSE 3000