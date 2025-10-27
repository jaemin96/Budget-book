import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as winston from "winston";
import * as path from "path";
import "winston-daily-rotate-file";

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly fileLogger: winston.Logger;

  constructor(context?: string) {
    super(context ?? "AppLogger");

    if (process.env.NODE_ENV !== "production") {
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
  }

  private format(message: string, serviceName?: string, userId?: string) {
    const userTag = userId ? `👤[${userId}]` : "";
    const serviceTag = serviceName ? `🚀[${serviceName}]` : "";
    return `${serviceTag} ${userTag} ${message}`;
  }

  private writeToFile(level: string, message: string, serviceName?: string, userId?: string) {
    if (!this.fileLogger) return;
    this.fileLogger.log(level, this.format(message, serviceName, userId));
  }

  log(message: string, serviceName: string, userId?: string) {
    const formatted = this.format(message, serviceName, userId);
    super.log(formatted);
    this.writeToFile("info", message, serviceName, userId);
  }

  error(message: string, stack?: string, serviceName?: string, userId?: string) {
    const formatted = this.format(message, serviceName, userId);
    super.error(formatted, stack);
    this.writeToFile("error", `${message} ${stack ?? ""}`, serviceName, userId);
  }

  warn(message: string, serviceName?: string, userId?: string) {
    const formatted = this.format(message, serviceName, userId);
    super.warn(formatted);
    this.writeToFile("warn", message, serviceName, userId);
  }

  debug(message: string, serviceName?: string, userId?: string) {
    const formatted = this.format(message, serviceName, userId);
    super.debug(formatted);
    this.writeToFile("debug", message, serviceName, userId);
  }

  verbose(message: string, serviceName?: string, userId?: string) {
    const formatted = this.format(message, serviceName, userId);
    super.verbose(formatted);
    this.writeToFile("verbose", message, serviceName, userId);
  }
}
