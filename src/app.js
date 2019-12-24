class Application {

  constructor({ server, database }) {
    this.server = server;
    this.database = database;
  }

  async start() {
    await Promise.all([
      this.database.connect(),
      this.server.start()
    ]);
  }
}

module.exports = Application;
