import app from "./server.ts";
import { env } from "../env.ts";

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${env.APP_STAGE}`);
});
