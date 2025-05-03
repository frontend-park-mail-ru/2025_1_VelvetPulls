import express from "express";
import morgan from "morgan";
import path from "path";

const app = express();

const port = 80;

const hostname = "90.156.217.108";

app.use(morgan("dev"));
app.use(express.static("src"));
app.use(express.static("node_modules"));
app.use(express.static("server/static"));

app.get("*", (req, res) => {
    res.sendFile(path.resolve("src", "index.html"));
});

app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}/`);
});
