const express = require('express');
const { connectToDatabase } = require('./config/config');
const { processDeleteMessage } = require('./controllers/audit.controller'); // Import the controller function
const logger = require('./utils/logger');
const amqp = require('amqplib');

const app = express();

app.use(express.json());

async function consumeMessages() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'deletion_audit_queue';

    await channel.assertQueue(queue, { durable: true });
    logger.info(` [*] Waiting for messages from ${queue}`);

    channel.consume(queue, (message) => {
      if (message) {
        const content = message.content.toString();
        logger.info(` [x] Received ${content}`);
        try {
          const deletedData = JSON.parse(content);
          processDeleteMessage(deletedData); // Call the controller function
        } catch (parseError) {
          logger.error('Error parsing message JSON:', parseError);
        } finally {
          channel.ack(message);
        }
      }
    }, { noAck: false }); // Ensure messages are acknowledged
  } catch (error) {
    logger.error('Error connecting to RabbitMQ:', error);
  }
}

connectToDatabase()
  .then(() => {
    logger.info('Connected to MySQL');
    consumeMessages(); // Start consuming messages after successful DB connection
  })
  .catch((err) => {
    logger.error('Failed to connect to database', err);
  });

module.exports = app;