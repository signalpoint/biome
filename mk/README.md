# setup

Install `node_modules` and `vendors`:
```
npm install
composer install
./scripts/downloadVendors.sh
```

# compile .js

```
npm run build
```

# server

Ratchet: http://socketo.me/docs/hello-world

```
sudo ufw allow 8080
php bin/chat-server.php
```

# php shmop

```
sudo vim /etc/php/8.3/apache2/php.ini

# uncomment the `extension=shmop` line, then...

sudo systemctl restart apache2
```

```
# inspect shared memory
ipcs -m
```

# ssh

```
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_github
```
