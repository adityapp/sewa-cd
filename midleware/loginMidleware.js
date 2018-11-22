const jwt = require('express-jwt')

const midleware = jwt({
    secret: "minhug8gf75de6w47r58tg7yh8uj"
})

module.exports = midleware