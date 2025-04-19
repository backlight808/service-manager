const { connectToDatabase } = require('../config/config');
const logger = require('../utils/logger');

const auditController = {
  processDeleteMessage: async (deletedData) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const { id, city, temperature, conditions, humidity, latitude, longitude } = deletedData;
      const deletedAt = new Date(); // Capture the deletion timestamp

      await connection.execute(
        'INSERT INTO auditdb.weather_data_audit (deleted_id, city, temperature, `conditions`, humidity, latitude, longitude, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, city, temperature, conditions, humidity, latitude, longitude, deletedAt]
      );
      logger.info('Successfully audited deleted record');
      await connection.close();
    } catch (error) {
      logger.error('Error auditing deleted record:', error);
    }
  }
};

module.exports = auditController;