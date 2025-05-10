# syntax = docker/dockerfile:1.4
# Etapa 1: Construção
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

COPY prisma ./prisma/
COPY tsconfig.json ./
COPY next.config.ts ./
COPY .env ./.env

# Cria diretório para cache do Yarn
ENV YARN_CACHE_FOLDER=/app/.yarn-cache

# Usa BuildKit para montar o cache de dependências
RUN --mount=type=cache,target=/app/.yarn-cache \
    yarn install --frozen-lockfile --network-concurrency 4 --cache-folder $YARN_CACHE_FOLDER || \
    (echo "Tentando novamente sem prefer-offline..." && yarn install --frozen-lockfile --network-concurrency 4 --cache-folder $YARN_CACHE_FOLDER)

# Gera os tipos do Prisma
RUN yarn prisma generate

# Copia o restante do código para a build
COPY . .

# Compila o projeto Next.js
RUN yarn build

# Etapa 2: Imagem final para produção
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/.env ./.env

# Configura o Prisma Data Proxy (se necessário)
ENV PRISMA_CLIENT_ENGINE_TYPE="dataproxy"

# Define a variável de ambiente para produção
ENV NODE_ENV=production
ENV PORT=3000

# Exponha a porta da aplicação
EXPOSE 3000

# Health check para garantir que o serviço está ativo
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --spider --quiet http://localhost:3000 || exit 1

# Inicia o servidor Next.js
CMD ["yarn", "start"]