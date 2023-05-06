#!/bin/sh

# Set your domain here
DOMAIN="${DOMAIN}"

# Get the certificate or renew it if needed
certbot certonly --standalone --agree-tos --non-interactive --email quentin.goujon@epita.fr -d $DOMAIN --pre-hook "apachectl stop" --post-hook "apachectl start" --keep

# Copy the certificates and keys
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /usr/local/apache2/conf/server.crt
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /usr/local/apache2/conf/server.key

# Start Apache in the foreground
httpd -D FOREGROUND
