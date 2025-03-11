import express from "express";
import morgan from "morgan";
import path from "path";

const app = express();
const port = 80;
const hostname = "0.0.0.0";
const __dirname = "static";
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve("public", "index.html"));
});

app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}/`);
});
