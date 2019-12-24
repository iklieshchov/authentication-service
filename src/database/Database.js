const { connect } = require('mongoose');

class Database {
  constructor({ config }) {
    this.config = config;
  }

  async connect() {
    const uri = this.mongoDbUri(this.config.database);
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    };
    return await connect(uri, options, (err) => {
      if (err) {
        console.error('[Database]:', err)
      } else {
        console.log('[Database]: connected');
      }
    });
  }

  mongoDbUri(config) {
    const credentials = '';
    if (config.user && config.pass) {
      credentials = `${config.user}:${config.pass}@`;
    }
    return `mongodb://${credentials}${config.host}:${config.port}/${config.name}`;
  };
}

module.exports = {
  Database
};
