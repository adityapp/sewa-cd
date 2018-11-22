const express = require("express")
const router = express.Router()
const db = require("./db")

const cdController = require('./controllers/cd')
const genreController = require('./controllers/genre')
const peminjamanController = require('./controllers/peminjaman')
const userController = require('./controllers/user')
const discountController = require('./controllers/discount')

const app = express()
app.use(express.json()) //midleware

router.use(cdController)
router.use(genreController)
router.use(peminjamanController)
router.use(userController)
router.use(discountController)

app.use('/api', router)

app.listen(3000, () => console.log("Server jalan"))
