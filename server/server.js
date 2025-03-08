import express from "express";
import morgan from "morgan"
import path from "path";

const app = express();
const port = 8081;
const hostname = 'localhost';

app.use(morgan("dev"));
app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}/`);
});