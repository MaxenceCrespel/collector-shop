const isValidCredentialString = (value) => typeof value === 'string' && !value.includes('\0');

module.exports = { isValidCredentialString };
