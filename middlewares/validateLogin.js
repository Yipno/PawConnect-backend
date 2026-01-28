const { body, validationResult } = require('express-validator');

// Tableau de middleware
const validateLoginBody = [
  body('email')
    .exists()
    .withMessage('EMAIL_REQUIRED')
    .trim()
    .isEmail()
    .withMessage('EMAIL_INVALID')
    .normalizeEmail(),

  body('password')
    .exists()
    .withMessage('PASSWORD_REQUIRED')
    .bail()
    .isString()
    .withMessage('PASSWORD_INVALID')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('PASSWORD_REQUIRED')
    .bail()
    .isLength({ min: 6 })
    .withMessage('PASSWORD_TOO_SHORT'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        details: errors.array(),
      });
    }
    next();
  },
];

module.exports = validateLoginBody;
