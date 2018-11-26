const express = require('express')
const router = express.Router()
const db = require("../db")
const loginMidleware = require('../midleware/loginMidleware')
const adminMidleware = require('../midleware/adminMidleware')

router.get("/discount", async (req, res) => {
    try {
        const [rows, fields] = await db.connection.execute("SELECT * FROM discounts;")
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.post('/discount', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("INSERT INTO `discounts`(`code`, `discount`) VALUES (?,?);",
            [body.code, body.discount])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.put('/discount/:code', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("UPDATE `discounts` SET `code`=?,`discount`=? WHERE `code`=?;",
            [body.code, body.discount, req.params.code])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.delete('/discount/:code', async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("DELETE FROM `discounts` WHERE `code`=?;",
            [req.params.code])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

module.exports = router