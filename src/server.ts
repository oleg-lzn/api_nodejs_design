import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Server is Running",
    timestamp: new Date().toISOString(),
    service: "Api Practice",
  });
});

export default app;
