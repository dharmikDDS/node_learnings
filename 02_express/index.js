import express, { response } from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = 8000;
const host = "127.0.0.1";

const books = [];
let nextId = 1;

const moragnFormat = ":method :url :status :response-time ms";
const bookNotFound = { success: false, msg: "book not found." };

// middleware to parse JSON in req-body
app.use(express.json());

app.use(
  morgan(moragnFormat, {
    stream: {
      write: (msg) => {
        logger.info(
          JSON.stringify({
            method: msg.split(" ")[0],
            url: msg.split(" ")[1],
            status: msg.split(" ")[2],
            responseTime: msg.split(" ")[3],
          })
        );
      },
    },
  })
);

// home route
app.get("/", (req, res) => {
  res.send("Welcome to the Book Managment!");
});

// get all books
app.get("/books", (req, res) => {
  res.send({ success: true, books: books });
});

// get a single book
app.get("/books/:id", (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));

  if (book) {
    res.status(200).send({ success: true, data: { ...book } });
  } else {
    res.status(404).send({ ...bookNotFound });
  }
});

// add a book
app.post("/books", (req, res) => {
  const { name, author } = req.body;

  if (!name || !author) {
    res.status(400).send({
      success: false,
      msg: "missing required value - name || author.",
    });
  }

  if (books.find((book) => book.name === req.body.name)) {
    res.status(400).send({ success: false, msg: "the book is already exist." });
  }

  books.push({ id: nextId++, ...req.body });
  res.status(201).send({ success: true, msg: "book added successfully." });
});

// update existing book
app.post("/update-book/:id", (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ success: false, msg: "missing required value - id" });
  }

  const bookIndex = books.findIndex(
    (book) => book.id === parseInt(req.params.id)
  );

  if (bookIndex !== -1) {
    books[bookIndex] = { id: req.params.id, ...req.body };
    res.status(200).send({
      success: true,
      msg: "book updateed successfully.",
      data: books[bookIndex],
    });
  } else {
    res.status(404).send(bookNotFound);
  }
});

// delete a book
app.delete("/books/:id", (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ success: false, msg: "missing required value - id" });
  }

  const index = books.findIndex((book) => book.id === parseInt(req.params.id));

  console.log(`index = ${index}`);

  if (index !== -1) {
    const deletedBooks = books.splice(index, 1);
    res.status(200).send({
      success: true,
      msg: "book deleted successfully.",
      book: deletedBooks,
    });
  } else {
    res.status(404).send(bookNotFound);
  }
});

app.listen(port, host, () => {
  console.log(`listening to http://${host}:${port}`);
});
