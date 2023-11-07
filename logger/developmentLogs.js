var winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message }) => {
          return JSON.stringify({
              timestamp: timestamp,
              level: level,
              message: message
          });
      })
  ),
    transports: [
      new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
      new winston.transports.File({ filename: './logs/debug.log', level: 'debug' }),
      new winston.transports.File({ filename: './logs/all-logs.log' })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  }

module.exports = logger;
