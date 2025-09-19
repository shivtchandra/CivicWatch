# backend/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# system deps for prisma / native builds
RUN apk add --no-cache python3 build-base openssl

# copy package files
COPY package.json package-lock.json* ./

# install deps (use npm install so build succeeds even without package-lock.json)
RUN npm install --no-audit --no-fund

# copy app
COPY . .

# try to generate prisma client (if schema present)
RUN npx prisma generate || true

ENV NODE_ENV=development
EXPOSE 4000

CMD ["npm", "run", "dev"]
