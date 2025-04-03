import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "info", // Default log level
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...metadata }) => {
            let log = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
            if (Object.keys(metadata).length) {
                log += ` | metadata: ${JSON.stringify(metadata)}`;
            }
            return log;
        })
    ),
    transports: [
        new transports.Console(), // Logs to console
        new transports.File({ filename: "server.log" }), // Logs to file
    ],
});

export default logger;