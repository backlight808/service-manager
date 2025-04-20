const { connectToDatabase } = require('../config/config');
const logger = require('../utils/logger');

const auditController = {
  processDeleteMessage: async (deletedData) => {
    let connection;
    logger.info(deletedData);
    try {
      connection = await connectToDatabase();
      //const {program_id, program_name, start_date, end_date, principal_investigator, funding_amount, program_description } = deletedData;
      const {
        program_id,
        program_name,
        start_date,
        end_date,
        principal_investigator,
        funding_amount,
        program_description,
      } = deletedData;
     // Format the dates to 'YYYY-MM-DD'
     const formattedStartDate = start_date ? new Date(start_date).toISOString().split('T')[0] : null;
     const formattedEndDate = end_date ? new Date(end_date).toISOString().split('T')[0] : null;
     const deletedAt = new Date().toISOString().split('T')[0]; // Capture the deletion timestamp in 'YYYY-MM-DD'


     await connection.execute(
      'INSERT INTO medical_research_db.program_data_audit (program_id, program_name, start_date, end_date, principal_investigator, funding_amount, program_description, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        program_id,
        program_name,
        formattedStartDate,
        formattedEndDate,
        principal_investigator,
        funding_amount,
        program_description,
        deletedAt,
      ]
    );
      logger.info('Successfully audited deleted record');
      await connection.close();
    } catch (error) {
      logger.error('Error auditing deleted record:', error);
    }
  }
};

module.exports = auditController;