import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { title } from "process";

const app = express();
app.use(cors());
const port = 3000;
// const port = process.env || 3000;

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

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

// Статика з папки public
app.use(express.static(path.join(__dirname, "../public")));

// Головна сторінка
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

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
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }

  res.json(foundCourse);
});

// ➕ Створити новий курс
app.post("/courses", (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ error: "Title is required" });
  }

  const db = readDb();
  const newCourse: Course = {
    id: +new Date(),
    title: req.body.title.trim(),
  };

  db.courses.push(newCourse);
  writeDb(db);

  res.status(HTTP_STATUSES.CREATED_201).json(newCourse);
});

// ❌ Видалити курс за ID
app.delete("/courses/:id", (req, res) => {
  const id = +req.params.id;
  const db = readDb();

  const index = db.courses.findIndex((c) => c.id === id);
  if (index === -1) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ error: "Course not found" });
  }

  db.courses.splice(index, 1);
  writeDb(db);

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// 🔍 Змінити курс за ID
app.put("/courses/:id", (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ error: "Title is required" });
  }

  const db = readDb();
  const foundCourse = db.courses.find((c) => c.id === +req.params.id);

  // if (!foundCourse) {
  //   return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  // }

  if (!foundCourse) {
    return res.status(404).json({ error: "Course not found" });
  }

  foundCourse.title = req.body.title;

  writeDb(db); // <-- обовʼязково зберегти оновлення в файл

  // return  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204).json(foundCourse);
  return res.status(HTTP_STATUSES.OK_200).json(foundCourse);
});

//////////////////////////////////////////////////////////////////////////////////////
const dbPathPoducts = path.resolve(__dirname, "../productsDB.json");

interface Products {
  id: number;
  title: string;
}

// ✳️ Завантаження Products із файлу
const readDbProducts = (): { products: Products[] } => {
  const data = fs.readFileSync(dbPathPoducts, "utf-8");
  return JSON.parse(data);
};

// 💾 Збереження Products у файл
const writeDbProducts = (data: { products: Products[] }) => {
  fs.writeFileSync(dbPathPoducts, JSON.stringify(data, null, 2));
};

// -------------------------------------------------------------------------
const dbPathAdresses = path.resolve(__dirname, "../adressesDB.json");

interface Adresses {
  id: number;
  value: string;
}

// ✳️ Завантаження Adresses із файлу
const readDbAdresses = (): { adresses: Adresses[] } => {
  const data = fs.readFileSync(dbPathAdresses, "utf-8");
  return JSON.parse(data);
};

// 💾 Збереження Adresses у файл
const writeDbPAdresses = (data: { adresses: Adresses[] }) => {
  fs.writeFileSync(dbPathAdresses, JSON.stringify(data, null, 2));
};

// -------------------------------------------------------------------------

// const products = [
//   {title: 'tomato'},
//   {title: 'orange'},
// ]

// const adresses = [
//   {value: 'strit 1'},
//   {value: 'strit 11'}
// ]


// Всі продукти
// app.get("/products", (req: Request, res: Response) => {
//   const ProductsDb = readDbProducts();
//   let foundProducts = ProductsDb.products;
//   res.json(foundProducts);
// });


// ------------------------------------------ Products

// Отримати всі продукти за умовою
app.get("/products", (req: Request, res: Response) => {
  const ProductsDb = readDbProducts();
  let foundProducts = ProductsDb.products;

  if (req.query.title) {
    foundProducts = foundProducts.filter((c) =>
      c.title.toLowerCase().includes((req.query.title as string).toLowerCase())
    );
  }

  res.json(foundProducts);
});

// Отримати  продукт за
app.get("/products/:productId", (req: Request, res: Response) => {
  const ProductsDb = readDbProducts();
  let foundProducts = ProductsDb.products;
  let foundProduct = foundProducts.find((c) => c.id === +req.params.productId);

  if (!foundProduct) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }

  res.json(foundProduct);
});

// ➕ Створити новий продукт
app.post("/products", (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ error: "Title is required" });
  }

  const ProductsDb = readDbProducts();
  const newProduct: Products = {
    id: +new Date(),
    title: req.body.title.trim(),
  };

  ProductsDb.products.push(newProduct);
  writeDbProducts(ProductsDb);

  res.status(HTTP_STATUSES.CREATED_201).json(newProduct);
});

// ❌ Видалити продукт за ID
app.delete("/products/:id", (req, res) => {
  const id = +req.params.id;
  const ProductsDb = readDbProducts();

  const index = ProductsDb.products.findIndex((c) => c.id === id);
  if (index === -1) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ error: "Product not found" });
  }

  ProductsDb.products.splice(index, 1);
  writeDbProducts(ProductsDb);

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// 🔍 Змінити продукт
app.put("/products/:id", (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ error: "Title is required" });
  }

  const ProductsDb = readDbProducts();
  const foundProduct = ProductsDb.products.find((c) => c.id === +req.params.id);

  if (!foundProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  foundProduct.title = req.body.title;

  writeDbProducts(ProductsDb);

  return res.status(HTTP_STATUSES.OK_200).json(foundProduct);
});


// ------------------------------------------ Adresess
// Отримати всі адреси за умовою
app.get("/adresses", (req: Request, res: Response) => {
  const AdressesDb = readDbAdresses();
  let foundAdresses = AdressesDb.adresses;

  if (req.query.value) {
    foundAdresses = foundAdresses.filter((c) =>
      c.value.toLowerCase().includes((req.query.value as string).toLowerCase())
    );
  }

  res.json(foundAdresses);
});

//  Отримати адресу за ID
app.get("/adresses/:id", (req: Request, res: Response) => {
  const AdressesDb = readDbAdresses();
  let foundAdresses = AdressesDb.adresses;
  let foundAdress = foundAdresses.find((c) => c.id === +req.params.id);

  if (!foundAdress) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  }

  res.json(foundAdress);
});

//  Створити нову адресу
app.post("/adresses", (req, res) => {
  if (!req.body.value || req.body.value.trim() === "") {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ error: "Title is required" });
  }

  const AdressesDb = readDbAdresses();
  const newAdress: Adresses = {
    id: +new Date(),
    value: req.body.value.trim(),
  };

  AdressesDb.adresses.push(newAdress);
  writeDbPAdresses(AdressesDb);

  res.status(HTTP_STATUSES.CREATED_201).json(newAdress);
});

//  Видалити адресу за ID
app.delete("/adresses/:id", (req, res) => {
  const id = +req.params.id;
  const AdressesDb = readDbAdresses();

  const index = AdressesDb.adresses.findIndex((c) => c.id === id);
  if (index === -1) {
    return res
      .status(HTTP_STATUSES.NOT_FOUND_404)
      .json({ error: "Adress not found" });
  }

  AdressesDb.adresses.splice(index, 1);
  writeDbPAdresses(AdressesDb);

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

// 🔍 Змінити адресу

app.put("/adresses/:id", (req, res) => {
  if (!req.body.value || req.body.value.trim() === "") {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST_400)
      .json({ error: "Title is required" });
  }

  const AdressesDb = readDbAdresses();
  const foundAdress = AdressesDb.adresses.find((c) => c.id === +req.params.id);

  if (!foundAdress) {
    return res.status(404).json({ error: "Adress not found" });
  }

  foundAdress.value = req.body.value;

  writeDbPAdresses(AdressesDb);

  return res.status(HTTP_STATUSES.OK_200).json(foundAdress);
});

///////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
