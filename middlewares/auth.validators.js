const { body, validationResult } = require('express-validator');

// Validation middleware chain
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

// Validation middleware chain
const validateSignupBody = [
  body('lastName')
    .exists()
    .withMessage('LASTNAME_REQUIRED')
    .isString()
    .withMessage('LASTNAME_INVALID')
    .trim()
    .notEmpty()
    .withMessage('LASTNAME_REQUIRED'),

  body('firstName')
    .exists()
    .withMessage('FIRSTNAME_REQUIRED')
    .isString()
    .withMessage('FIRSTNAME_INVALID')
    .trim()
    .notEmpty()
    .withMessage('FIRSTNAME_REQUIRED'),

  body('role')
    .exists()
    .withMessage('ROLE_REQUIRED')
    .isString()
    .withMessage('ROLE_INVALID')
    .isIn(['civil', 'agent'])
    .withMessage('ROLE_INVALID'),

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
    .isString()
    .withMessage('PASSWORD_INVALID')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('PASSWORD_REQUIRED')
    .bail()
    .isLength({ min: 6 })
    .withMessage('PASSWORD_TOO_SHORT'),

  body('establishmentId')
    .custom((value, { req }) => {
      const role = req.body.role;
      if (role === 'agent') {
        if (!value) throw new Error('ESTABLISHMENT_REQUIRED');
      } else if (role === 'civil') {
        if (value) throw new Error('ESTABLISHMENT_FORBIDDEN');
      }
      return true;
    })
    .bail()
    .if(body('role').equals('agent'))
    .isMongoId()
    .withMessage('INVALID_EST_ID'),

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

module.exports = { validateLoginBody, validateSignupBody };
