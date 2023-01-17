FROM node:18-alpine
WORKDIR /src/
COPY . package.json
RUN npm install
RUN npm install typescript
COPY . .
RUN npx tsc -b
CMD ["node", "app.js"]
EXPOSE 3000