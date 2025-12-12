const { setPriority } = require('../modules/setPriority');

describe('setPriority function', () => {
  it('returns FAIBLE for empty array or invalid input', () => {
    expect(setPriority([])).toBe('FAIBLE');
    expect(setPriority(null)).toBe('FAIBLE');
  });

  it('calculates MODERE for a single BLESSE (50)', () => {
    expect(setPriority(['BLESSE'])).toBe('MODERE');
  });

  it('calculates URGENT for BLESSE + DANGER (100)', () => {
    expect(setPriority(['BLESSE', 'DANGER'])).toBe('URGENT');
  });

  it('normalizes inputs (accents and case) and dedupes', () => {
    expect(setPriority(['Blessé', 'blessé', 'JEUNE'])).toBe('IMPORTANT');
    // Blessé (50) + JEUNE (10) = 60 => IMPORTANT
    expect(setPriority(['Blessé', 'JEUNE'])).toBe('IMPORTANT');
  });
});
