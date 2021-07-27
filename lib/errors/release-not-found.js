const util = require('util');

function ReleaseNotFound(nonExistentRelease) {
  this.message = `Current version '${nonExistentRelease}' is not found.`;
  Error.captureStackTrace(this);
}

util.inherits(ReleaseNotFound, Error);
ReleaseNotFound.prototype.name = 'ReleaseNotFound';

module.exports = ReleaseNotFound;
