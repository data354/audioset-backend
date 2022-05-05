/*eslint-env node*/
import http from "http";
import allApp from "./_globalRoutes";
import db from "../configs/db";

import env from "../configs/env"

const server = http.createServer(allApp);

const port = normalizePort(env.PORT);

server.listen(port);
server.on("listening", onListenning);
server.on("clientError", onError);
server.on("close", onClose);

function normalizePort(val: string) {
    const port = parseInt(val, 10);
    if (isNaN(port)) { return val; }
    if (port >= 0) { return port; }
}

function onError(error: any) {
    if (error.syscall !== "listen") { throw error; }
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            break;

        case "EADDRINUSE":
            console.error(bind + " is already in use");
            break;

        default:
            throw error;
    }

    process.exit(1);
}

function onClose() {
    db.$disconnect();
    process.exit(0);
}

function onListenning() {
    db.$connect()
        .then(() => { console.log("Database Connected"); })
        .catch((err: Error) => { console.error(err); });
}


console.log(`start on port ${port}`);

export default server;
