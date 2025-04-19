const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }), // Capture stack traces
    winston.format.json() // Log as JSON
  ),
  transports: [
    // Log to the console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colorize the output
        winston.format.simple() // Use a simple format
      )
    }),
    // Log to a file (optional)
    // new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;