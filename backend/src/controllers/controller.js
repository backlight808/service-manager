const { connectToDatabase } = require('../config/config');
const logger = require('../utils/logger');
const amqp = require('amqplib'); // Import the amqplib library

const programController = {
  getAllProgramData: async (req, res) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT * FROM medical_research_db.programs');
      res.json(rows);
      await connection.close();
    } catch (error) {
      logger.error('Error fetching all programs data:', error);
      res.status(500).json({ error: 'Failed to fetch programs data', details: error.message });
    }
  },

  createProgramData: async (req, res) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const { program_name, start_date, end_date, principal_investigator, funding_amount, program_description } = req.body;

      const [result] = await connection.execute(
        'INSERT INTO medical_research_db.programs (program_name, start_date, end_date, principal_investigator, funding_amount, program_description)  VALUES (?, ?, ?, ?, ?, ?)',
        [program_name, start_date, end_date, principal_investigator, funding_amount, program_description]
      );

      res.status(201).json({ message: 'Program data stored successfully!', id: result.insertId });
      await connection.close();
    } catch (error) {
      logger.error('Error storing Program data:', error);
      res.status(500).json({ error: 'Failed to store Program data', details: error.message });
    }
  },

  updateprogramData: async (req, res) => {
    let connection;
    try {
      connection = await connectToDatabase();
      const id = req.params.id;
      const { program_name, start_date, end_date, principal_investigator, funding_amount, program_description } = req.body;


      const [checkResult] = await connection.execute(
        'SELECT * FROM medical_research_db.programs WHERE program_id = ?', [id]);
      if (checkResult.length === 0) {
        res.status(404).json({ error: 'data not found' });
        await connection.close();
        return;
      }

      const [result] = await connection.execute(
        'UPDATE medical_research_db.programs SET program_name = ?, start_date = ?, end_date = ?, principal_investigator = ?, funding_amount = ?, program_description = ? WHERE program_id = ?',
        [program_name, start_date, end_date, principal_investigator, funding_amount, program_description, id]

      );

      res.json({ message: ' data edited successfully!', affectedRows: result.affectedRows });
      await connection.close();
    } catch (error) {
      logger.error('Error updating  data:', error);
      res.status(500).json({ error: 'Failed to update data', details: error.message });
    }
  },

  deleteProgramData: async (req, res) => {
    console.log('Delete Program Data called' + req.params.id); // Debugging log
    let connection;
    try {
      connection = await connectToDatabase();
      const id = req.params.id;

      const [checkResult] = await connection.execute('SELECT * FROM medical_research_db.programs WHERE program_id = ?', [id]);
      if (checkResult.length === 0) {
        res.status(404).json({ error: 'Program data not found' });
        await connection.close();
        return;
      }

      const [deletedRows] = await connection.execute('SELECT * FROM medical_research_db.programs WHERE program_id = ?', [id]);
      const deletedData = deletedRows[0]; // **Fix: Declare deletedData here, before the DELETE operation**
      try {
        const [result] = await connection.execute('DELETE FROM medical_research_db.programs WHERE program_id = ?', [id]);
        res.json({ message: 'data deleted successfully!', affectedRows: result.affectedRows });
        logger.info('Data deleted successfully!');
      }
      catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
          res.status(400).json({ error: 'Cannot delete program data because it is referenced by other records.' });
        } else {
          res.status(500).json({ error: 'Failed to delete program data', details: error.message });
        }
      }
      await connection.close();
      // Send message to RabbitMQ
      try {
        logger.info('Attempting to connect to RabbitMQ...'); // Added log
        const mqConnection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        logger.info('Successfully connected to RabbitMQ.'); // Added log
        const channel = await mqConnection.createChannel();
        const queue = 'deletion_audit_queue';
        const safeDeletedData = { 
          program_id: deletedData.program_id || null,
          program_name: deletedData.program_name || null,
          start_date:  deletedData.start_date || null,
          end_date: deletedData.end_date || null,
          principal_investigator: deletedData.principal_investigator || null, 
          funding_amount: deletedData.funding_amount || null,
          program_description: deletedData.program_description || null,
          deleted_at: new Date() || null // Capture the deletion timestamp
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
      logger.error('Error deleting  data:', error);
      res.status(500).json({ error: 'Failed to delete  data', details: error.message });
    }
  }
};

module.exports = programController;
