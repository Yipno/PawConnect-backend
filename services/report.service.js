const Establishment = require('../models/establishments');
const getDistanceBetweenTwoPoints = require('../modules/getDistanceBetweenTwoPoints');

const getProsToNotifyNewReport = async report => {
  //? LOGIQUE DE NOTIFICATION AUX PROS LORS D'UN NOUVEAU REPORT
  //? Recuperer les pros des etablissements les plus proches (rayon de 30km)
  if (!report?.location?.lat || !report?.location?.long) {
    throw new Error('location est manquante dans le report');
  }

  const establishments = await Establishment.find().select('location agents');

  const prosToNotify = [];
  for (const establishment of establishments) {
    const distance = getDistanceBetweenTwoPoints(
      { latitude: establishment.location.lat, longitude: establishment.location.long },
      { latitude: report.location.lat, longitude: report.location.long }
    );
    if (distance !== null && distance < 30) {
      prosToNotify.push(...establishment.agents);
    }
  }
  const uniqueProsToNotify = [...new Set(prosToNotify.map(pro => pro.toString()))];
  return uniqueProsToNotify;
};

module.exports = { getProsToNotifyNewReport };
