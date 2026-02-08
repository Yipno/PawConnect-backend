const { body, param, validationResult } = require('express-validator');

const validateReportBody = [
  body('location')
    .exists()
    .withMessage('LOCATION_REQUIRED')
    .bail()
    .isObject()
    .withMessage('LOCATION_INVALID'),

  body('location.lat')
    .exists()
    .withMessage('LOCATION_LAT_REQUIRED')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('LOCATION_LAT_INVALID'),

  body('location.long')
    .exists()
    .withMessage('LOCATION_LONG_REQUIRED')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('LOCATION_LONG_INVALID'),

  body('title')
    .exists()
    .withMessage('TITLE_REQUIRED')
    .bail()
    .isString()
    .isLength({ max: 200 })
    .withMessage('TITLE_INVALID')
    .trim()
    .notEmpty()
    .withMessage('TITLE_REQUIRED')
    .escape(),

  body('desc')
    .exists()
    .withMessage('DESCRIPTION_REQUIRED')
    .bail()
    .isString()
    .isLength({ max: 2000 })
    .withMessage('DESCRIPTION_INVALID')
    .trim()
    .notEmpty()
    .withMessage('DESCRIPTION_REQUIRED')
    .escape(),

  body('animalType')
    .exists()
    .withMessage('ANIMAL_TYPE_REQUIRED')
    .bail()
    .isString()
    .withMessage('ANIMAL_TYPE_INVALID')
    .isIn(['chat', 'chien'])
    .withMessage('ANIMAL_TYPE_INVALID'),

  body('state')
    .exists()
    .withMessage('STATE_REQUIRED')
    .bail()
    .isArray({ max: 10 })
    .withMessage('STATE_INVALID')
    .bail()
    .custom(states => {
      const allowed = [
        'blesse',
        'affaibli',
        'danger',
        'coince',
        'petits',
        'agressif',
        'peureux',
        'jeune',
        'sociable',
        'sain',
      ];
      return states.every(state => allowed.includes(state));
    })
    .withMessage('STATE_INVALID'),

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

const validatePhotoURL = [
  param('id').isMongoId().withMessage('INVALID_ID'),

  body('photoUrl')
    .exists()
    .withMessage('URL_REQUIRED')
    .bail()
    .isURL({
      protocols: ['https'],
      require_protocol: true,
    })
    .withMessage('INVALID_URL')
    .bail()
    .custom(value => {
      const url = new URL(value);
      if (url.hostname !== 'res.cloudinary.com') {
        throw new Error('INVALID_CLOUDINARY_HOST');
      }
      const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
      const hasValidExt = allowedExt.some(ext => url.pathname.toLowerCase().endsWith(ext));
      if (!hasValidExt) {
        throw new Error('INVALID_IMAGE_FORMAT');
      }
      return true;
    }),

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

const validateHistoryBody = [
  param('id').isMongoId().withMessage('INVALID_ID'),

  body('action')
    .exists()
    .withMessage('ACTION_REQUIRED')
    .bail()
    .isString()
    .isLength({ max: 500 })
    .withMessage('ACTION_INVALID')
    .bail()
    .trim()
    .notEmpty()
    .escape()
    .withMessage('ACTION_REQUIRED'),

  body('status')
    .exists()
    .withMessage('STATUS_REQUIRED')
    .bail()
    .isString()
    .withMessage('STATUS_INVALID')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('STATUS_REQUIRED')
    .bail()
    .isIn(['en cours', 'terminé']),

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

module.exports = { validateReportBody, validatePhotoURL, validateHistoryBody };
