FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install OpenSSL and dependencies
RUN apk add --no-cache \
    libc6-compat \
    openssl

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Builder stage
FROM base AS builder
WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

# Copy deps from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source files
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

# Define build arguments
ARG DATABASE_URL
ARG AWS_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG S3_BUCKET_NAME
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_CLIENT_EMAIL
ARG FIREBASE_PRIVATE_KEY
ARG NEXT_PUBLIC_UPLOAD_MAX_SIZE
ARG TWILIO_ACCOUNT_SID
ARG TWILIO_AUTH_TOKEN
ARG TWILIO_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_APP_URL
ARG CRON_SECRET_KEY
ARG INFOBIP_API_KEY
ARG INFOBIP_BASE_URL
ARG INFOBIP_WHATSAPP_NUMBER
ARG EMAIL_USER
ARG EMAIL_APP_PASSWORD
ARG APP_NAME
ARG TZ

# Set environment variables from build arguments
ENV DATABASE_URL=$DATABASE_URL
ENV AWS_REGION=$AWS_REGION
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV S3_BUCKET_NAME=$S3_BUCKET_NAME
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
ENV FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY
ENV NEXT_PUBLIC_UPLOAD_MAX_SIZE=$NEXT_PUBLIC_UPLOAD_MAX_SIZE
ENV TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID
ENV TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN
ENV TWILIO_WHATSAPP_NUMBER=$TWILIO_WHATSAPP_NUMBER
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV CRON_SECRET_KEY=$CRON_SECRET_KEY
ENV INFOBIP_API_KEY=$INFOBIP_API_KEY
ENV INFOBIP_BASE_URL=$INFOBIP_BASE_URL
ENV INFOBIP_WHATSAPP_NUMBER=$INFOBIP_WHATSAPP_NUMBER
ENV EMAIL_USER=$EMAIL_USER
ENV EMAIL_APP_PASSWORD=$EMAIL_APP_PASSWORD
ENV APP_NAME=$APP_NAME
ENV TZ=$TZ

# Build the application
RUN npm run build

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

# Copy necessary files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/node_modules ./node_modules

# Set proper permissions
RUN chown -R nextjs:nodejs .
RUN chown -R nextjs:nodejs /var/log/cron

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js
CMD ["node", "server.js"]