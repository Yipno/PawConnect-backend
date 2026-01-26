const Animal = require('../models/animals');

async function getCivilianReports(userId) {
  const reports = await Animal.find({ reporter: userId })
    .populate({
      path: 'establishment',
      select: 'name address location phone email logo url',
    })
    .sort({ date: -1 });
  return reports;
}

async function getAgentReports(userEstablishment) {
  const reports = await Animal.find({
    $or: [{ status: 'nouveau' }, { establishment: userEstablishment }],
  })
    .populate({
      path: 'currentHandler',
      select: 'firstName lastName',
    })
    .sort({ date: -1 });
  return reports;
}

module.exports = { getCivilianReports, getAgentReports };
