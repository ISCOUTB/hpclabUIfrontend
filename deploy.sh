cd /var/www/hpclabUIfrontend
git pull
stylus app/stylus/main.styl -o app/css
bower --allow-root install
chown www-data:www-data *
