FROM node:22-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
ENV VITE_API_URL=/api/v1
ENV VITE_SOCKET_URL=
RUN npm run build


FROM node:22-slim

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ .
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]