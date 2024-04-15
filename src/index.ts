import app from "./app";
import connectionToDatabase from "./services/db.postgres";
const PORT = process.env.PORT || 3000;

connectionToDatabase();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
