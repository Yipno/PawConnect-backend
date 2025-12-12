// ALGO DE CALCUL DE PRIORITÉ EN FONCTION DES STATUS SIGNALÉS
function setPriority(array = []) {
  const priorityValues = {
    BLESSE: 50,
    AFFAIBLI: 40,
    DANGER: 50,
    COINCE: 40,
    PETITS: 30,
    AGRESSIF: 20,
    PEUREUX: 10,
    JEUNE: 10,
    SOCIABLE: 0,
    SAIN: 0,
  };
  if (array.includes('BLESSE' || array.includes('DANGER'))) return 'URGENT';
  const score = array.reduce((total, state) => total + (priorityValues[state] || 0), 0);
  if (score >= 80) return 'URGENT';
  if (score >= 60) return 'IMPORTANT';
  if (score >= 40) return 'MODERE';
  return 'FAIBLE';
}

module.exports = { setPriority };
