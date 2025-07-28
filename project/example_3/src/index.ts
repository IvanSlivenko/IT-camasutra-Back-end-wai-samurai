import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
const port = 3000;

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../currentDb.json");

interface Course {
  id: number;
  title: string;
}

// ✳️ Завантаження курсів із файлу
const readDb = (): { courses: Course[] } => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

// 💾 Збереження курсів у файл
const writeDb = (data: { courses: Course[] }) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

app.use(express.json());

// 🔍 Отримати всі курси (з фільтром за назвою)
app.get("/courses", (req, res) => {
  const db = readDb();
  let foundCourses = db.courses;

  if (req.query.title) {
    foundCourses = foundCourses.filter((c) =>
      c.title.toLowerCase().includes((req.query.title as string).toLowerCase())
    );
  }

  res.json(foundCourses);
});

// 🔍 Отримати курс за ID
app.get("/courses/:id", (req, res) => {
  const db = readDb();
  const foundCourse = db.courses.find((c) => c.id === +req.params.id);

  if (!foundCourse) {
    return res.sendStatus(404);
  }

  res.json(foundCourse);
});

// ➕ Створити новий курс
app.post("/courses", (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const db = readDb();
  const newCourse: Course = {
    id: +new Date(),
    title: req.body.title.trim(),
  };

  db.courses.push(newCourse);
  writeDb(db);

  res.status(201).json(newCourse);
});

// ❌ Видалити курс за ID
app.delete("/courses/:id", (req, res) => {
  const id = +req.params.id;
  const db = readDb();

  const index = db.courses.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  db.courses.splice(index, 1);
  writeDb(db);

  res.sendStatus(204);
});

// 🔍 Змінити курс за ID
app.put("/courses/:id", (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const db = readDb();
  const foundCourse = db.courses.find((c) => c.id === +req.params.id);

  if (!foundCourse) {
    return res.sendStatus(404);
  }

  foundCourse.title = req.body.title;

  writeDb(db); // <-- обовʼязково зберегти оновлення в файл

  res.json(foundCourse);
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
