'use Strict';  
 
require('@babel/register')
require('@babel/polyfill');
const http = require ('http');

const app = require('../app').default;
const server = http.createServer(app);
const config = require('../config/config').config;
const port = config.PORT;

server.listen(port);

server.on('listening', ()=> {
   console.log(`Listening on ${port}`);
});
