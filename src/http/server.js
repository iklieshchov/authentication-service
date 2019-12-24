const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

class Server {

  constructor({ config, router }) {
    this.config = config;
    this.express = express();
    this.express.use(cookieParser());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(router);
  }

  async start() {
    return new Promise((resolve) => {
      const http = this.express.listen(this.config.http.port, _ => {
        const { port } = http.address();
        console.log(`Listening at port ${port}`);
        resolve();
      });
    });
  }
}

module.exports = {
  Server
};
