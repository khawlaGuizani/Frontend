#!/bin/sh
# Substitutes the environment-specific placeholders left in
# /etc/nginx/conf.d/default.conf (see the comments in nginx.conf) before
# starting nginx:
#   __RESOLVER__     -> this container's actual nameserver (Docker's
#                        127.0.0.11, or Kubernetes' kube-dns ClusterIP)
#   __BACKEND_HOST__ -> the backend's reachable name; defaults to the short
#                        container name used in Docker Compose, override
#                        with $BACKEND_HOST (e.g. a Kubernetes Service FQDN)
set -e

resolver=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
backend_host="${BACKEND_HOST:-transport-backend}"

sed -e "s/__RESOLVER__/${resolver}/" \
    -e "s/__BACKEND_HOST__/${backend_host}/" \
    /etc/nginx/conf.d/default.conf > /tmp/default.conf
cat /tmp/default.conf > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
