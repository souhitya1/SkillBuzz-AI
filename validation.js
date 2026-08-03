const Joi = require("joi");

const validateCourse = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required().messages({
            "string.empty": "Course title cannot be empty.",
            "string.min": "Course title must be at least 3 characters long.",
            "any.required": "Course title is required."
        }),
        description: Joi.string().min(10).required().messages({
            "string.empty": "Course description cannot be empty.",
            "string.min": "Course description must be at least 10 characters long.",
            "any.required": "Course description is required."
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map(el => el.message).join(". ");
        req.flash("error", errorMessage);
        return res.redirect("/skillbuzz/new"); // Redirect back to the form
    }

    next();
};

module.exports = { validateCourse };