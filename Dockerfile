# syntax=docker/dockerfile:1

# ============================================================================
# Stage 1: Build — install deps and produce the production Angular bundle.
# ============================================================================
FROM node:22-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ============================================================================
# Stage 2: Runtime — nginx serving static assets + reverse-proxying /api.
# ============================================================================
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

COPY --from=build /build/dist/transport-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /usr/share/nginx/html /var/cache/nginx /var/run \
    && touch /var/run/nginx.pid \
    && chown appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
