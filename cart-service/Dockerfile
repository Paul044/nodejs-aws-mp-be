FROM node:12.19-alpine AS base

WORKDIR /app


FROM base AS dependencies
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available
COPY package*.json ./

# Install packages abd clear npm cache
RUN npm install && npm cache clean --force
# If you are building your ocde for production
# RUEN npm ci --only=prodcution

FROM dependencies AS build
# Buidle app source

WORKDIR /app
COPY . .
RUN npm run build


# Release with Alpine
# Excluding folders other than build as not needed
FROM node:12.19-alpine AS release
WORKDIR /app
COPY --from=dependencies /app/package*.json ./

# Install app dependencies
RUN npm install --only=production
COPY --from=build /app/dist ./

EXPOSE 4000

CMD ["node", "main"]