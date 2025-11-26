import pino from "pino";

export const logger = pino({
  level: "info",
  transport:
    process.env.APP_STAGE === "dev"
      ? {
          target: "pino-pretty",
          options: { colorize: true },
        }
      : undefined,
});
