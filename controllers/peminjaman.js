const express = require('express')
const router = express.Router()
const db = require('../db')
const loginMidleware = require('../midleware/loginMidleware')

router.get("/peminjaman", loginMidleware, async (req, res) => {
    try {
        const [rows, fields] = await db.connection.execute("SELECT * FROM peminjaman WHERE `user_id`=?;", [req.user.id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.post('/peminjaman', async (req, res) => {
    try {
        const body = req.body
        const cek = await db.connection.execute("SELECT stock FROM `cd` where `id`=?;", [body.cd_id])

        if (cek[0][0].stock > 0) {
            const [rows, fields] = await db.connection.execute("INSERT INTO `peminjaman`(`user_id`, `cd_id`, `time_start`, `time_end`, `price`, `denda`, `discount`, `total`) VALUES (?,?,?,?,?,?,?,?);",
                [body.user_id, body.cd_id, body.time_start, body.time_end, body.price, body.denda, body.discount, body.total])
            res.json(rows)
        } else {
            res.status(400).json({
                status: "Stock Habis"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.put('/peminjaman/:id', async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("UPDATE `peminjaman` SET `user_id`=?,`cd_id`=?,`time_start`=?,`time_end`=?,`price`=?,`denda`=?,`discount`=?,`total`=? WHERE `id`=?;",
            [body.user_id, body.cd_id, body.time_start, body.time_end, body.price, body.denda, body.discount, body.total, req.params.id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.delete('/peminjaman/:id', async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("DELETE FROM `peminjaman` WHERE `id`=?;",
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