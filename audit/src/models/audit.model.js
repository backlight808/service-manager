module.exports = {
    name: 'program_data_audit',
    columns: {
        deleted_id: { type: 'INT', primaryKey: true },
        program_id: 'INT',
        program_name: 'VARCHAR(255)',
        start_date: 'VARCHAR(255)',
        end_date: 'TIMESTAMP',
        principal_investigator: 'VARCHAR(255)',
        funding_amount: 'DECIMAL(10,2)',
        program_description: 'VARCHAR(255)',
        deleted_at: 'TIMESTAMP'
    }
};