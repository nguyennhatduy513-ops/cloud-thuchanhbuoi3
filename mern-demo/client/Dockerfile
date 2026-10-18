FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Cài đặt công cụ serve để chạy bản build của Create React App
RUN npm install -g serve

EXPOSE 4173

CMD ["serve", "-s", "build", "-l", "4173"]