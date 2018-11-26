const express = require('express')
const router = express.Router()
const db = require('../db')
const loginMidleware = require('../midleware/loginMidleware')
const adminMidleware = require('../midleware/adminMidleware')

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

router.get("/allpeminjaman", loginMidleware, adminMidleware, async (req, res) => {
    try {
        const [rows, fields] = await db.connection.execute("SELECT * FROM peminjaman;")
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
        const cd = await db.connection.execute("SELECT * FROM `cd` where `id`=?;", [body.cd_id])
        let discounts= []
        let discount = 0
        if(body.discount_id != null){
            discounts = await db.connection.execute("SELECT * FROM `discounts` where `code`=?;", [body.discount_id])
            discount = discounts[0][0].discount
        }
        const timeStart = new Date()
        const timeEnd = new Date(body.time_end)
        const hari = Math.round((timeEnd - timeStart)/ 86400000)
        const total = cd[0][0].harga * hari - discount

        if (cd[0][0].stock > 0) {
            const [rows, fields] = await db.connection.execute("INSERT INTO `peminjaman`(`user_id`, `cd_id`, `discount_id`, `time_start`, `time_end`, `time_return`, `denda`, `total`) VALUES (?,?,?,NOW(),?,null,0,?);",
                [body.user_id, body.cd_id, body.discount_id, body.time_end, total])
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

router.put('/pengembalian/:id', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const timeReturn = new Date(body.time_return)
        const timeEnd = new Date(body.time_end)
        const hari = Math.round((timeReturn - timeEnd)/ 86400000)
        const total = body.total + (1000 * hari)

        const [rows, fields] = await db.connection.execute("UPDATE `peminjaman` SET `time_end`=?,`time_return`=?,`denda`=?,`total`=? WHERE `id`=?;",
            [body.time_end, body.time_return, 1000*hari, total, req.params.id])
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