import app from "./app";
import { PORT } from "./utils/keys";
import { connectionToDatabase } from "./database/config/db.config";
import * as http from "http";
import { config } from "./utils/socket.util";
// serve connection
connectionToDatabase();

const server = http.createServer(app);
config(server);

server.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
