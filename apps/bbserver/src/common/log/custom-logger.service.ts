import { ConsoleLogger, Injectable } from "@nestjs/common";
import * as winston from "winston";
import * as path from "path";
import "winston-daily-rotate-file";

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly fileLogger: winston.Logger | null;
  private readonly isServerless: boolean;

  constructor(context?: string) {
    super(context ?? "AppLogger");

    // Vercel 서버리스 환경 감지 (VERCEL 환경 변수 또는 LAMBDA_TASK_ROOT)
    this.isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_LAMBDA_FUNCTION_NAME);

    // 서버리스 환경에서는 파일 로깅 비활성화 (읽기 전용 파일 시스템)
    if (this.isServerless) {
      console.log("[CustomLogger] Serverless environment detected - file logging disabled");
      this.fileLogger = null;
    } else {
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

  private writeToFile(level: string, message: string, serviceName: string = "", userId: string = "") {
    // 서버리스 환경에서는 파일 로깅 건너뛰기
    if (this.fileLogger) {
      this.fileLogger.log(level, this.format(message, serviceName, userId));
    }
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
