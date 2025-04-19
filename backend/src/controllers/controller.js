const { connectToDatabase } = require('../config/config');
const logger = require('../utils/logger');
const amqp = require('amqplib'); // Import the amqplib library

const weatherController = {
  getAllWeatherData: async (req, res) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM researchdb.weather_data');
      res.json(rows);
      await connection.close();
    } catch (error) {
      logger.error('Error fetching all weather data:', error);
      res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
  },

  createWeatherData: async (req, res) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const { city, temperature, conditions, humidity, latitude, longitude } = req.body;

      const [result] = await connection.execute(
        'INSERT INTO researchdb.weather_data (city, temperature, `conditions`, humidity, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
        [city, temperature, conditions, humidity, latitude, longitude]
      );

      res.status(201).json({ message: 'Weather data stored successfully!', id: result.insertId });
      await connection.close();
    } catch (error) {
      logger.error('Error storing weather data:', error);
      res.status(500).json({ error: 'Failed to store weather data', details: error.message });
    }
  },

  updateWeatherData: async (req, res) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const id = req.params.id;
      const { city, temperature, conditions, humidity, latitude, longitude } = req.body;

      const [checkResult] = await connection.execute('SELECT * FROM researchdb.weather_data WHERE id = ?', [id]);
      if (checkResult.length === 0) {
        res.status(404).json({ error: 'Weather data not found' });
        await connection.close();
        return;
      }

      const [result] = await connection.execute(
        'UPDATE researchdb.weather_data SET city = ?, temperature = ?, `conditions` = ?, humidity = ?, latitude = ?, longitude = ? WHERE id = ?',
        [city, temperature, conditions, humidity, latitude, longitude, id]
      );

      res.json({ message: 'Weather data updated successfully!', affectedRows: result.affectedRows });
      await connection.close();
    } catch (error) {
      logger.error('Error updating weather data:', error);
      res.status(500).json({ error: 'Failed to update weather data', details: error.message });
    }
  },

  deleteWeatherData: async (req, res) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const id = req.params.id;

      const [checkResult] = await connection.execute('SELECT * FROM researchdb.weather_data WHERE id = ?', [id]);
      if (checkResult.length === 0) {
        res.status(404).json({ error: 'Weather data not found' });
        await connection.close();
        return;
      }

      const [deletedRows] = await connection.execute('SELECT * FROM weather_data WHERE id = ?', [id]);
      const deletedData = deletedRows[0]; // **Fix: Declare deletedData here, before the DELETE operation**

      const [result] = await connection.execute('DELETE FROM weather_data WHERE id = ?', [id]);
      res.json({ message: 'Weather data deleted successfully!', affectedRows: result.affectedRows });
      await connection.close();
       // Send message to RabbitMQ
       try {
        logger.info('Attempting to connect to RabbitMQ...'); // Added log
        const mqConnection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        logger.info('Successfully connected to RabbitMQ.'); // Added log
        const channel = await mqConnection.createChannel();
        const queue = 'deletion_audit_queue';
        const safeDeletedData = {
          id: deletedData.id,
          city: deletedData.city ?? null,
          temperature: deletedData.temperature ?? null,
          conditions: deletedData.condition ?? null,
          humidity: deletedData.humidity ?? null,
          latitude: deletedData.latitude ?? null,
          longitude: deletedData.longitude ?? null,
        };
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(safeDeletedData)), {
          persistent: true
        });
        logger.info(` [x] Sent deleted data to RabbitMQ queue: ${queue}`);
        await channel.close();
        await mqConnection.close();
      } catch (mqError) {
        logger.error('Error sending message to RabbitMQ:', mqError);
        //  Include the full error, including the stack trace if available
        logger.error('RabbitMQ Connection Error Details:', mqError);
      }
      await connection.close();
    } catch (error) {
      logger.error('Error deleting weather data:', error);
      res.status(500).json({ error: 'Failed to delete weather data', details: error.message });
    }
  }
};

module.exports = weatherController;