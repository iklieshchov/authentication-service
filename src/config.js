
const config = {
  http: {
    port: process.env.PORT || 3000
  },
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'authentication',
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD
  },
  tokens: {
    access: {
      private: process.env.ACCESS_CERT_PRIVATE || '/certificates/access.key',
      public: process.env.ACCESS_CERT_PUBLIC || '/certificates/access.pem',
      expiresIn: process.env.ACCESS_EXPIRES_IN || '24h'
    },
    refresh: {
      private: process.env.REFRESH_CERT_PRIVATE || '/certificates/refresh.key',
      public: process.env.REFRESH_CERT_PUBLIC || '/certificates/refresh.pem',
      expiresIn: process.env.REFRESH_EXPIRES_IN || '30d'
    }
  }
};

module.exports = config;
