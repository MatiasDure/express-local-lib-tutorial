const authorCollection = require("../models/author");
const bookCollection = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.author_list = asyncHandler(async function (req, res, next){
    const allAuthors = await authorCollection.find({}).sort( { last_name:1 } ).exec();

    res.render("author_list", {
        title:"Author List",
        author_list: allAuthors
    });
});

exports.author_detail = asyncHandler(async function (req, res, next){
    const [author, booksByAuthor] = await Promise.all([
        authorCollection.findById(req.params.id).exec(),
        bookCollection.find( { author: req.params.id }, "title summary").exec()
    ]);

    if(author === null)
    {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
    }


    res.render("author_detail", {
        title: "Author Details",
        author: author,
        author_books: booksByAuthor
    });
});

//display author create form on GET
exports.author_create_get = function (req, res, next){
    res.render("author_form", 
    {
        title: "Create Author",
    });
};

//Handle author create on POST
exports.author_create_post = [
    body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters"),

    body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters"),

    body("date_of_birth", "Invalid date of birth")
    .optional({ values:"falsy" })
    .isISO8601()
    .toDate(),

    body("date_of_death", "Invalid date of death")
    .optional({ values:"falsy" })
    .isISO8601()
    .toDate(),    

    //process request after validation
    asyncHandler(async function (req, res, next) {
        const errors = validationResult(req);

        // Create AUthor object with escaped and trimmed data
        const createdAuthor = new authorCollection({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death
        });

        if(!errors.isEmpty())
        {
            res.render("author_form", {
                title: "Create Author",
                author: createdAuthor,
                errors: errors.array(),
            });

            return;
        }

        //save new created author document
        await createdAuthor.save();

        res.redirect(createdAuthor.url);
    }),
];

//display author delete form on GET
exports.author_delete_get = asyncHandler(async function (req, res, next){
    //get details of author and all their books (in parallel)
    const [author, allBooksByAuthor] = await Promise.all([
        authorCollection.findById(req.params.id).exec(),
        bookCollection.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if (author === null)
    {
        res.redirect("/catalog/authors");
        return;
    }

    res.render("author_delete", {
        title: "Delete author",
        author: author,
        author_books: allBooksByAuthor,
    });
});

//Handle author delete form on POST
exports.author_delete_post = asyncHandler(async function (req, res, next){
    const [author, allBooksByAuthor] = await Promise.all([
        authorCollection.findById(req.params.id).exec(),
        bookCollection.find({ author: req.params.id }, "title summary").exec(),
    ]);

    if(allBooksByAuthor.length > 0)
    {
        //author has books
        res.render("author_delete", {
            title: "Delete Author",
            author: author,
            author_books: allBooksByAuthor,
        });

        return;
    }

    await authorCollection.findByIdAndRemove(req.body.authorid);
    
    res.redirect("/catalog/authors");
});

//display author update form on GET
exports.author_update_get = asyncHandler(async function (req, res, next){
    res.send("Not implemented: Author update GET");
});

//Handle author update on POST
exports.author_update_post = asyncHandler(async function (req, res, next){
    res.send("Not implemented: Author update POST");
});