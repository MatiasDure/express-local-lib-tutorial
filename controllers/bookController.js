const bookCollection = require("../models/book");
const authorCollection = require("../models/author");
const genreCollection = require("../models/genre");
const bookInstanceCollection = require("../models/bookInstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numBooks,
    numBookInstances,
    numAvailableBookInstances,
    numAuthors,
    numGenres
  ] = await Promise.all([
    bookCollection.countDocuments({}).exec(),
    bookInstanceCollection.countDocuments({}).exec(),
    bookInstanceCollection.countDocuments({ status: "Available"}).exec(),
    authorCollection.countDocuments({}).exec(),
    genreCollection.countDocuments({}).exec()
  ]);

  res.render("index", {
    title: "Local Library Home",
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres
  });
});

// Display list of all books.
exports.book_list = asyncHandler(async (req, res, next) => {
  const allBooks = await bookCollection.find({}, "title author")
  .sort({title: 1})
  .populate("author")
  .exec();

  res.render("book_list", {title: "Book List", book_list: allBooks});
});

// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    bookCollection.findById(req.params.id).populate("author").populate("genre").exec(),
    bookInstanceCollection.find( {book: req.params.id} ).exec()
  ]);

  if(book === null)
  {
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("book_detail", {
    title: book.title,
    book: book,
    book_instances: bookInstances
  });
});

// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
    const [allAuthors, allGenres] = await Promise.all([
      authorCollection.find().exec(),
      genreCollection.find().exec(),
    ]);

    res.render("book_form", {
      title: "Create Book",
      authors: allAuthors,
      genres: allGenres,
    });
});

// Handle book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    if(!(req.body.genre instanceof Array))
    {
      req.body.genre = typeof req.body.genre === "undefined" ? 
      [] :
      new Array(req.body.genre);
    }

    next();
  },

  body("title", "Title must not be empty.")
  .trim()
  .isLength( {min: 1} )
  .escape(),

  body("author", "Author must not be empty.")
  .trim()
  .isLength( {min: 1} )
  .escape(),

  body("summary", "Summary must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("isbn", "ISBN must not be empty")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("genre. *").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookCreated = new bookCollection({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if(!errors.isEmpty())
    {
      const [allAuthors, allGenres] = await Promise.all([
        authorCollection.find().exec(),
        genreCollection.find().exec()
      ]);

      for(const genre of allGenres)
      {
        if(bookCreated.genre.includes(genre._id)) genre.checked = "true";
      }

      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: bookCreated,
        errors: errors.array(),
      });

      return;
    }

    await bookCreated.save();

    res.redirect(bookCreated.url);
  })
];

// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
});

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  const [book, allAuthors, allGenres] = await Promise.all([
    bookCollection.findById(req.params.id)
    .populate("author")
    .populate("genre")
    .exec(),
    authorCollection.find().exec(),
    genreCollection.find().exec(),
  ]);

  if(book === null)
  {
    const error = new Error("Book not found");
    error.status = 404;
    
    return next(error);
  }

  //mark our selected genres as checked.
  for(const genre of allGenres)
  {
    for (const book_genre of book.genre)
    {
      if(genre._id.toString() === book_genre._id.toString()) genre.checked = "true";
    }
  }

  res.render("book_form", {
    title: "Update Book",
    authors: allAuthors,
    genres: allGenres,
    book: book
  });
});

// Handle book update on POST.
exports.book_update_post = [
  (req, res, next) => {
    if(!(req.body.genre instanceof Array))
    {
      req.body.genre = typeof req.body.genre === "undefined" ? [] : new Array(req.body.genre);
    }

    next();
  },

  body("title", "Title must no be empty.")
  .trim()
  .isLength({ min: 1})
  .escape(),

  body("author", "Author must not be empty.")
  .trim()
  .isLength({ min: 1})
  .escape(),

  body("summary", "Summary must not be empty.")
  .trim()
  .isLength({ min: 1})
  .escape(),

  body("isbn", "ISBN must not be empty.")
  .trim()
  .isLength({ min: 1})
  .escape(),

  body("genre. *").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const updatedBook = new bookCollection({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
      _id: req.params.id,
    });

    if(!errors.isEmpty())
    {
      const [allAuthors, allGenres] = await Promise.all([
        authorCollection.find().exec(),
        genreCollection.find().exec(),
      ]);

      // mark our selected genres as checked
      for(const genre in allGenres)
      {
        if(updatedBook.genre.indexOf(genre._id) > -1) genre.checked = "true";
      }

      res.render("book_form", {
        title: "Update Book",
        authors: allAuthors,
        genres: allGenres,
        book: updatedBook,
        errors: errors.array(),
      });

      return;
    }

    const finalizedUpdatedBook = await bookCollection.findByIdAndUpdate(req.params.id, updatedBook, {});

    res.redirect(finalizedUpdatedBook.url);
  })
];
