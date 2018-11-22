const express = require('express')
const router = express.Router()
const db = require('../db')
const loginMidleware = require('../midleware/loginMidleware')
const adminMidleware = require('../midleware/adminMidleware')

router.get('/genre', async (req, res) => {
    try {
        const [rows, fields] = await db.connection.execute("SELECT * FROM genre;")
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.post('/genre', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("INSERT INTO `genre`(`name`) VALUES (?);",
            [body.name])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.put('/genre/:id', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("UPDATE `genre` SET `name`=? WHERE `id`=?;",
            [body.name, req.params.id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.delete('/genre/:id', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("DELETE FROM `genre` WHERE `id`=?;",
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