import winston, { format } from "winston";
const { combine, timestamp, json } = format;

const logger = winston.createLogger({
  level: "error",
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: "logs.log" })],
});

export default logger;
