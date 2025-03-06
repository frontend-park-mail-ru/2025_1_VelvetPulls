import express from "express";
import morgan from "morgan"
import path from "path";

const app = express();
const port = 8081;
const hostname = 'localhost';

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.static("images"));

app.post('/login', (req, res) => {
    res.send('Hello World')
});
  
app.post('/signup', (req, res) => {
  res.send('Hello World!!!')
});

app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}/`);
});