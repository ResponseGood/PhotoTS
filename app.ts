import express from "express";
import * as path from "path";

import { authRouter } from "./routes/authRoute";
import { photosRouter } from "./routes/photos";
import mongoose from 'mongoose';
import { DB_URL }  from "./config";
export const app = express();

const port = 3000;
const server = app.listen(port, onListening);


app.use(express.json());



app.use(express.static(path.join(__dirname, "../public")));
app.use("/", authRouter);
app.use("/", photosRouter);
server.on("error", onError);

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    mongoose.connect(DB_URL,{ useNewUrlParser: true })
    .then(() => {

        console.log('Database connected');
    })
    .catch((err) => {
            console.log(`Connection failed ${err.message}`);
    });
    console.log(`Listening on ${bind}`);
}

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}