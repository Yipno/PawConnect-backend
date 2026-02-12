const Establishment = require('../models/Establishment.model');
const { getDistanceBetweenTwoPoints } = require('../utils/getDistanceBetweenTwoPoints');

const getRecipientsForNewReport = async report => {
  // Find agents from nearby establishments (within 35km radius) to notify
  if (!report?.location?.lat || !report?.location?.long) {
    throw new Error('MISSING_REPORT_LOCATION');
  }

  const establishments = await Establishment.find().select('location agents');

  const agentsToNotify = [];
  for (const establishment of establishments) {
    const distance = getDistanceBetweenTwoPoints(
      { latitude: establishment.location.lat, longitude: establishment.location.long },
      { latitude: report.location.lat, longitude: report.location.long },
    );
    if (distance !== null && distance < 35) {
      agentsToNotify.push(...establishment.agents);
    }
  }
  const uniqueAgentIds = [...new Set(agentsToNotify.map(agent => agent.toString()))];
  return uniqueAgentIds;
};

module.exports = { getRecipientsForNewReport };
