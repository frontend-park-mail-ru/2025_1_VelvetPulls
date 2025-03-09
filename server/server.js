import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Получаем текущий путь к файлу (ES-модули)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8081;
const hostname = 'localhost';


// Указываем путь к папке public
const publicPath = path.join(__dirname, "..", "public");


// Middleware для статических файлов
app.use(express.static(publicPath));


// Включаем логирование
app.use(morgan("dev"));

// Роутинг
app.get("/chat", (req, res) => {
  res.sendFile(path.join(publicPath, "main_page.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(publicPath, "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(publicPath, "signup.html"));
});

// Запуск сервера
app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}/`);
});