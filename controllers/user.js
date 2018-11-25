const express = require('express')
const router = express.Router()
const db = require("../db")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginMidleware = require('../midleware/loginMidleware')
const adminMidleware = require('../midleware/adminMidleware')

router.get('/users', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const [rows, fields] = await db.connection.execute("SELECT * FROM users WHERE `type` = 'user';")
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.get('/profil', loginMidleware, async (req, res)=>{
    try {
        const body = req.user
        const [rows, fields] = await db.connection.execute("SELECT * FROM users where `id`=?;",
        [body.id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("SELECT * FROM users where `name` = ?;", [body.name])
        const password = rows[0].password
        const isValid = await bcrypt.compare(body.password, password)
        if (isValid) {
            const token = await jwt.sign({
                id: rows[0].id,
                type: rows[0].type
            }, "minhug8gf75de6w47r58tg7yh8uj")
            res.json({token: token, type : rows[0].type})
        } else {
            res.status(401).json({
                status: "Unautorized"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.post('/register', async (req, res) => {
    try {
        const body = req.body
        const password = await bcrypt.hash(body.password, 12)
        const [rows, fields] = await db.connection.execute("INSERT INTO `users`(`name`, `password`, `alamat`, `phone`, `type`) VALUES (?,?,?,?,?);",
            [body.name, password, body.alamat, body.phone, "user"])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.put('/user/:id', async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("UPDATE `users` SET `name`=?,`password`=?,`alamat`=?,`phone`=?,`type`=? WHERE `id`=?;",
            [body.name, body.password, body.alamat, body.phone, body.type, req.params.id])
        res.json(rows)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "ERROR BRO"
        })
    }
})

router.delete('/user/:id', loginMidleware, adminMidleware, async (req, res) => {
    try {
        const body = req.body
        const [rows, fields] = await db.connection.execute("DELETE FROM `users` WHERE `id`=?;",
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