function isPasswordValid(password) {
  return password && password.length >= 6;
}
module.exports = { isPasswordValid };
