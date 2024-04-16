import app from "./app";
import connectionToDatabase from "./services/db.postgres";
import { PORT } from "./utils/keys";

connectionToDatabase();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
