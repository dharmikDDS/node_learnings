import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(format.colorize(), format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "app.log" }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `level: ${level}, message: ${message}: time: ${timestamp}`;
        })
      ),
    }),
  ],
});

export default logger;
