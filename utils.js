const AppError = require("./controlError/AppError")

// Utility func...
module.exports.validity = (day) => 1000 * 60 * 60 * 24 * day

module.exports.handleValidationErr = (err) => {
  return new AppError(`Validation Failed...${err.message}`, 400)
}
