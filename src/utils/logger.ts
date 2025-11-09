import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {
    target: "pino/file",
    options: { destination: "src/logs/app.log" },
  },
});
