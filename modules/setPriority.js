// ALGO DE CALCUL DE PRIORITÉ EN FONCTION DES STATUS SIGNALÉS
function setPriority(array = []) {
  if (array.length === 0) return 'faible';
  const priorityValues = {
    blesse: 50,
    affaibli: 40,
    danger: 50,
    coince: 40,
    petits: 30,
    agressif: 20,
    peureux: 10,
    jeune: 10,
    sociable: 0,
    sain: 0,
  };
  if (array.includes('blesse') || array.includes('danger')) return 'urgent';
  const score = array.reduce((total, state) => total + (priorityValues[state] || 0), 0);
  if (score >= 80) return 'urgent';
  if (score >= 60) return 'important';
  if (score >= 40) return 'modere';
  return 'faible';
}

module.exports = { setPriority };
