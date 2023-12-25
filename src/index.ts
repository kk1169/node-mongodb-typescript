import express from "express"
import http from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import compression from "compression";
import mongoose from "mongoose";
import routes from "./routes";

const app = express();
app.use(cors({
    credentials: true
}))
app.use(compression());
app.use(cookieParser());
app.use(express.json());

const MONGO_URL = "mongodb://127.0.0.1:27017";
mongoose.connect(MONGO_URL, {
    dbName: 'node-mongo-typescript'
}).then(() => {
    console.log('Database Connected.');
}).catch((error) => console.log(error));

app.use("/", routes())

const server = http.createServer(app);

server.listen(4000, () => {
    console.log(`Server running on http://localhost:4000`);
})

