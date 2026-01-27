const cloudinary = require('cloudinary').v2;
cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });

async function signatureHandler(req, res, next) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(timestamp, cloudinary.config().api_secret);

    return res.status(200).json({
      timestamp,
      signature,
      apiKey: cloudinary.config().api_key,
      cloudName: cloudinary.config().cloud_name,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { signatureHandler };
