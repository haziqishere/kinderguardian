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

# Define build arguments for sensitive data
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG FIREBASE_PRIVATE_KEY
ARG DATABASE_URL
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Set build-time environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add Firebase configuration
ENV NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=kinderguardian-51c2d
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kinderguardian-51c2d.appspot.com
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=353015432149
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:353015432149:web:f76fa0e44d5a67e0e60b0f

ENV FIREBASE_PROJECT_ID=kinderguardian-51c2d
ENV FIREBASE_CLIENT_EMAIL=firebase-adminsdk-suap4@kinderguardian-51c2d.iam.gserviceaccount.com
ENV FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}

# AWS Configuration
ENV AWS_REGION=ap-southeast-5
ENV AWS_BUCKET_NAME=kinderguardian-student-images-dev
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}

# Database URL
ENV DATABASE_URL=${DATABASE_URL}

# App URL
ENV NEXT_PUBLIC_APP_URL=http://kinderguardian.tech

# Generate Prisma Client again in builder stage
RUN npx prisma generate

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
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs .
RUN chown -R nextjs:nodejs /var/log/cron

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start both Next.js and cron
CMD ["sh", "-c", "crond -f -d 8 & node server.js"]