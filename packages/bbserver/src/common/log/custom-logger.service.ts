import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as winston from "winston";
import * as path from "path";
import "winston-daily-rotate-file";

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly fileLogger: winston.Logger;

  constructor(context?: string) {
    super(context ?? "AppLogger");

    const logDir = path.join(process.cwd(), "logs");

    this.fileLogger = winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: logDir,
          filename: "%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "10m",
          maxFiles: "14d",
          level: "debug",
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            winston.format.printf(({ timestamp, level, message }) => {
              return `[${timestamp}] ${level.toUpperCase()} ${message}`;
            }),
          ),
        }),
      ],
    });
  }

  private writeToFile(level: string, message: string, context?: string) {
    const formattedMessage = context ? `[${context}] ${message}` : message;
    this.fileLogger.log(level, formattedMessage);
  }

  log(message: string, context?: string) {
    super.log(message, context);
    this.writeToFile("info", message, context);
  }

  error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context);
    this.writeToFile("error", `${message} ${stack ?? ""}`, context);
  }

  warn(message: string, context?: string) {
    super.warn(message, context);
    this.writeToFile("warn", message, context);
  }

  debug(message: string, context?: string) {
    super.debug(message, context);
    this.writeToFile("debug", message, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);
    this.writeToFile("verbose", message, context);
  }
}
