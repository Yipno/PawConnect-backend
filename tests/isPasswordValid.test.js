const { isPasswordValid } = require('../utils/isPasswordValid');

test('password doit être >= à 6 caractères', () => {
  expect(isPasswordValid('12345')).toBe(false);
  expect(isPasswordValid('123456')).toBe(true);
});
