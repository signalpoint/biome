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
