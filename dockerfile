FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache \
    libc6-compat \
    openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy environment variables from .env file
COPY .env .env

# Source environment variables from .env file
RUN set -a && \
    grep -v '^#' .env | grep -v '^$' > .env.tmp && \
    source .env.tmp && \
    set +a && \
    npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install required packages
RUN apk add --no-cache \
    openssl \
    dcron \
    curl

# Create cron directory and log file
RUN mkdir -p /var/log/cron
RUN touch /var/log/cron/alerts.log

# Add crontab file
COPY crontab /etc/crontabs/root
RUN chmod 0644 /etc/crontabs/root

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files and set proper structure
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/.env .env

# Ensure node_modules is copied from standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/node_modules ./node_modules

# Set proper permissions
RUN chown -R nextjs:nodejs .
RUN chown -R nextjs:nodejs /var/log/cron

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start both Next.js and cron
CMD ["sh", "-c", "set -a && grep -v '^#' .env | grep -v '^$' > .env.tmp && source .env.tmp && set +a && crond -f -d 8 & node server.js"]