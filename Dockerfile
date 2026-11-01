FROM php:8.2-apache
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/* \
 && sed -i 's/Listen 80/Listen 3000/' /etc/apache2/ports.conf \
 && sed -i 's/:80>/:3000>/' /etc/apache2/sites-available/000-default.conf \
 && printf '%s\n' '<Directory /var/www/html>' '  FallbackResource /index.php' '</Directory>' \
    '<FilesMatch "\.pvue$">' '  Require all denied' '</FilesMatch>' 'RedirectMatch 404 /\.dist/' \
    > /etc/apache2/conf-enabled/app.conf
COPY www/ /var/www/html/
USER www-data
EXPOSE 3000
