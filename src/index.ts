import app from "./server.ts";
import { env } from "../env.ts";
import { z } from "zod";

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Environment: ${env.APP_STAGE}`);
});
