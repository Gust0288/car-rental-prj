type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private getLogStyle(level: LogLevel): string {
    const styles = {
      INFO: "color: #3b82f6; font-weight: bold",
      WARN: "color: #f59e0b; font-weight: bold",
      ERROR: "color: #ef4444; font-weight: bold",
      DEBUG: "color: #8b5cf6; font-weight: bold",
    };
    return styles[level];
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): [string, string, ...any[]] {
    const timestamp = this.formatTimestamp();
    const baseMessage = `[${timestamp}] [%c${level}%c] ${message}`;
    const args: any[] = [this.getLogStyle(level), ""];

    if (context) {
      args.push("\nContext:", context);
    }

    return [baseMessage, ...args] as [string, string, ...any[]];
  }

  info(message: string, context?: LogContext): void {
    const [msg, ...args] = this.formatMessage("INFO", message, context);
    console.log(msg, ...args);
  }

  warn(message: string, context?: LogContext): void {
    const [msg, ...args] = this.formatMessage("WARN", message, context);
    console.warn(msg, ...args);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : { error };

    const fullContext = { ...context, ...errorDetails };
    const [msg, ...args] = this.formatMessage("ERROR", message, fullContext);
    console.error(msg, ...args);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const [msg, ...args] = this.formatMessage("DEBUG", message, context);
      console.debug(msg, ...args);
    }
  }

  // Browser-specific utility methods
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(`%c${label}`, "color: #10b981; font-weight: bold");
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  table(data: any): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }
}

export const logger = new Logger();
