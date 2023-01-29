const startServer = async () => {
  const db = require('./db');
  await db.bootstrap();

  require('./app');
};

startServer();
