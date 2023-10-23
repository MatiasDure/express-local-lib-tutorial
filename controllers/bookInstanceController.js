const bookInstanceCollection = require("../models/bookInstance");
const bookCollection = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await bookInstanceCollection.find({}).populate("book").exec();

  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await bookInstanceCollection.findById(req.params.id).populate("book").exec();

  if(bookInstance === null)
  {
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("bookinstance_detail", {
    title: "Book:",
    bookinstance: bookInstance
  });
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await bookCollection.find({}, "title").exec();
  
  res.render("bookinstance_form", {
    title: "Create Book Instance",
    book_list: allBooks
  });
});

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [ 
  body("book", "Book must be specified")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  
  body("imprint", "Imprint must be specified")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("status").escape(),

  body("due_back", "Invalid date")
  .optional({ values: "falsy" })
  .isISO8601()
  .toDate(),

  asyncHandler(async (req, res, next) => {
    //extract validation errors from the request
    const errors = validationResult(req);

    const createdBookInstance = new bookInstanceCollection({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if(!errors.isEmpty())
    {
      const allBooks = await bookCollection.find({}, "title").exec();

      res.render("bookinstance_form", {
        title: "Create Book Instance",
        book_list: allBooks,
        selected_book: createdBookInstance.book._id,
        errors: errors.array(),
        bookinstance: createdBookInstance
      });

      return;
    }

    await createdBookInstance.save();
    
    res.redirect(createdBookInstance.url);
  }),
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});
