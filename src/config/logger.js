import winston from 'winston';

// 1. Define custom logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 2. Dynamically determine the log level based on the environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// 3. Define the brand colors for your terminal output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// 4. Configure how the logs look
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
  )
);

// 5. Define where the logs go (Transports)
const transports = [
  // Always log to the console
  new winston.transports.Console(),
  
  // Write all severe errors to a specific file for auditing
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.uncolorize(), // Keep files clean of terminal color codes
  }),
  
  // Write every single log to a combined file
  new winston.transports.File({ 
    filename: 'logs/combined.log',
    format: winston.format.uncolorize(),
  }),
];

// 6. Export the compiled logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});