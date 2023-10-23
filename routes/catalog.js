const express = require("express");
const router = express.Router();

//require controllers modules
const bookController = require("../controllers/bookController");
const authorController = require("../controllers/authorController");
const bookInstanceController = require("../controllers/bookInstanceController");
const genreController = require("../controllers/genreController");

// Book routes //

// get catalog home page
router.get("/", bookController.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", bookController.book_create_get);

// POST request for creating a book.
router.post("/book/create", bookController.book_create_post);

// GET request for deleting book
router.get("/book/:id/delete", bookController.book_delete_get);

// POST request for deleting book
router.post("/book/:id/delete", bookController.book_delete_post);

// GET request for updating book
router.get("/book/:id/update", bookController.book_update_get);

// POST request for updating book
router.post("/book/:id/update", bookController.book_update_post);

// GET request for one book
router.get("/book/:id", bookController.book_detail);

// GET request for all books
router.get("/books", bookController.book_list);

// AUTHOR ROUTES //

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/author/create", authorController.author_create_get);

// POST request for creating a book.
router.post("/author/create", authorController.author_create_post);

// GET request for deleting book
router.get("/author/:id/delete", authorController.author_delete_get);

// POST request for deleting book
router.post("/author/:id/delete", authorController.author_delete_post);

// GET request for updating book
router.get("/author/:id/update", authorController.author_update_get);

// POST request for updating book
router.post("/author/:id/update", authorController.author_update_post);

// GET request for one book
router.get("/author/:id", authorController.author_detail);

// GET request for all books
router.get("/authors", authorController.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genreController.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genreController.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genreController.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genreController.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genreController.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genreController.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genreController.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genreController.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get(
  "/bookinstance/create",
  bookInstanceController.bookinstance_create_get,
);

// POST request for creating BookInstance.
router.post(
  "/bookinstance/create",
  bookInstanceController.bookinstance_create_post,
);

// GET request to delete BookInstance.
router.get(
  "/bookinstance/:id/delete",
  bookInstanceController.bookinstance_delete_get,
);

// POST request to delete BookInstance.
router.post(
  "/bookinstance/:id/delete",
  bookInstanceController.bookinstance_delete_post,
);

// GET request to update BookInstance.
router.get(
  "/bookinstance/:id/update",
  bookInstanceController.bookinstance_update_get,
);

// POST request to update BookInstance.
router.post(
  "/bookinstance/:id/update",
  bookInstanceController.bookinstance_update_post,
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", bookInstanceController.bookinstance_detail);

// GET request for list of all BookInstance.
router.get("/bookinstances", bookInstanceController.bookinstance_list);

module.exports = router;
