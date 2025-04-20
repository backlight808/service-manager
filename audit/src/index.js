const app = require('./app');
const logger = require('./utils/logger');

const port = process.env.PORT || 3002;  // Use a different port than the  service

app.listen(port, () => {
  logger.info(`Audit service running on http://localhost:${port}`);
});