FROM oven/bun:1.1-alpine

ENV TZ=Asia/Manila

WORKDIR /app

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .

RUN bun --bun run build

RUN apk add --no-cache libreoffice msttcorefonts-installer fontconfig openjdk8-jre
RUN update-ms-fonts 

EXPOSE 3000

CMD ["bun", "--bun", "run", "start"]