// Define the schema for the audit table (optional, but good for clarity)
module.exports = {
    name: 'weather_data_audit',
    columns: {
        deleted_id: { type: 'INT', primaryKey: true }, //stores the id of the deleted record.
        city: 'VARCHAR(255)',
        temperature: 'DECIMAL(10, 2)',
        conditions: 'VARCHAR(255)',
        humidity: 'VARCHAR(255)',
        latitude: 'DECIMAL(10, 6)',
        longitude: 'DECIMAL(10, 6)',
        deleted_at: 'TIMESTAMP'
    }
};