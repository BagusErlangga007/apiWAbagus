const VALID_TOKEN = "yuhu";

function authorization(tokens) {
  if (tokens == VALID_TOKEN) return true;
  return false;
}

module.exports = authorization;
