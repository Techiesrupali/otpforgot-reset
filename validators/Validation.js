const { body, validationResult } = require('express-validator');

// Validation middleware for login route
const loginValidation = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
];

// Validation middleware for register route
const registerValidation = [
    body('username').notEmpty().withMessage('First name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    // body('confirmPassword').custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //         throw new Error('Passwords do not match');
    //     }
    //     return true;
    // })
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};

module.exports = { loginValidation, registerValidation, validate };
