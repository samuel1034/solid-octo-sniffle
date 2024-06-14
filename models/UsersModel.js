const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');

class UsersModel {
    constructor() {
        this.db = new sqlite3.Database('./conf/test.db', (err) => {
            if (err) {
                console.log('No se pudo conectar a la base de datos', err.message);
                return;
            }
            console.log('Conectado con éxito a la base de datos SQLite.');
        });

        this.db.run(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password TEXT)',
            (err) => {
                if (err) {
                    console.error(err.message);
                }
            }
        );
    }

    createUser(username, email, password) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            this.db.run(sql, [username, email, password], function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                console.log(`Se ha insertado un usuario con el ID ${this.lastID}`);
                resolve({ id: this.lastID, username, email, password });
            });
        });
    }

    async getUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const get = promisify(this.db.get).bind(this.db);
        return await get(sql, [email]);
    }

    async getUserByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const get = promisify(this.db.get).bind(this.db);
        return await get(sql, [username]);
    }

    async getUserByUsernameOrEmail(identifier) {
        const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
        const get = promisify(this.db.get).bind(this.db);
        return await get(sql, [identifier, identifier]);
    }

    async getUserById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const get = promisify(this.db.get).bind(this.db);
        return await get(sql, [id]);
    }
}

module.exports = UsersModel;
