import app from "./app";
import { PORT } from "./utils/keys";
import { connectionToDatabase } from "./database/config/db.config";
// serve connection
connectionToDatabase();

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
