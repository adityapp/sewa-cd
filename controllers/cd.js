const express = require('express')
const router = express.Router()
const db = require("../db")
const loginMidleware = require('../midleware/loginMidleware')
const adminMidleware = require('../midleware/adminMidleware')

router.get("/cd", async (req, res) => {
    try {
        const [rows, fields] = await db.connection.execute("SELECT * FROM cd;")
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.post('/cd', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("INSERT INTO `cd`(`name`, `stock`, `harga`, `genre_id`) VALUES (?,?,?,?);",
            [body.name, body.stock, body.harga, body.genre_id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.put('/cd/:id', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("UPDATE `cd` SET `name`=?,`stock`=?,`harga`=?,`genre_id`=? WHERE `id` = ?;",
            [body.name, body.stock, body.harga, body.genre_id, req.params.id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.delete('/cd/:id', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("DELETE FROM `cd` WHERE `id`=?;",
            [req.params.id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

module.exports = router