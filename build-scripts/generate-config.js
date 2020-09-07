const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./src/assets/config.sample.json', 'utf-8'));

config.auth.client_id = process.env.AUTH0_CLIENT_ID;
config.auth.domain = process.env.AUTH0_DOMAIN;

fs.writeFileSync('./dist/prepit-planner/assets/config.json', JSON.stringify(config), 'utf-8');
