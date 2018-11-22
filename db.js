const sql = require("mysql2/promise")

class Database {
    constructor() {
        this.init()  
    }

    async init() {
        this.db = await sql.createPool({
            host: "localhost",
            user: "root",
            database: "sewa-cd"
        })
    }

    get connection() {
        return this.db
    }
}

module.exports = new Database()