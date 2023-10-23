const genreCollection = require("../models/genre");
const bookCollection = require("../models/book");
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await genreCollection.find({}).sort( { name:1 } ).exec();

  res.render("genre_list", {
    title: "Genre List",
    genre_list: allGenres
  })
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // res.send(`NOT IMPLEMENTED: Genre detail: ${req.params.id}`);
  const [genre, booksOfGenre] = await Promise.all([
    genreCollection.findById(req.params.id).exec(),
    bookCollection.find( { genre: req.params.id }, "title sumamry" ).exec()
  ]);

  if(genre === null)
  {
    const err = new Error("Genre not found");
    err.status = 404;

    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksOfGenre
  });
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {

  res.render("genre_form", {
    title: "Create Genre",
  });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
  .trim()
  .isLength( { min: 3 } )
  .escape(),

  //process request after validation and sanitization
  asyncHandler(async (req, res, next) => { 
    const errors = validationResult(req);

    const createdGenre = new genreCollection({ name: req.body.name });

    //there were errors
    if (!errors.isEmpty())
    {
      res.render("genre_form",
      {
        title: "Create Genre",
        genre: createdGenre,
        errors: errors.array(),
      });

      return;
    }

    //look for an array with the same name
    const existingGenre = await genreCollection.findOne({ name: req.body.name })
    .collation({ locale: "en", strength: 2 })
    .exec();

    if(existingGenre) res.redirect(existingGenre.url);
    else
    {
      await createdGenre.save();

      res.redirect(createdGenre.url);
    }

  }),
]

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
