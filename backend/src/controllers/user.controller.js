const { connectToDatabase } = require('../config/config');
const logger = require('../utils/logger');
const amqp = require('amqplib'); // Import the amqplib library

const userController = {
 

  applyForProgram: async (req, res) => {
    debugger;
    let connection;
    try {
      connection = await connectToDatabase();
      const { program_id, participant_name, date_of_birth, gender, medical_history, consent_form } = req.body;

      const [result] = await connection.execute(
        'INSERT INTO medical_research_db.participants (program_id, participant_name, date_of_birth, gender, medical_history, consent_form)  VALUES (?, ?, ?, ?, ?, ?)',
        [program_id, participant_name, date_of_birth, gender, medical_history, consent_form]
      );

      res.status(201).json({ message: 'Application data stored successfully!', id: result.insertId });
      await connection.close();
    } catch (error) {
      logger.error('Error storing Appliaction data:', error);
      res.status(500).json({ error: 'Failed to store Application data', details: error.message });
    }
  },
 
};

module.exports = userController;
 