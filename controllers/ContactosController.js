// ContactosController.js

const ContactosModel = require("../models/ContactosModel");
const sendNotificationEmail = require('../utils/email');

class ContactosController {
    constructor() {
        this.contactosModel = new ContactosModel();
        this.add = this.add.bind(this);
        this.getAll = this.getAll.bind(this);
    }

    async add(req, res) {
        // Validate form data
        const { name, email, comment, pais } = req.body;

        if (!name || !email || !comment) {
            res.status(400).send("Faltan campos requeridos");
            return;
        }

        try {
            // Get user IP
            const ip = req.ip;
            // Save contact in database
            const fecha = new Date().toISOString();
            await this.contactosModel.crearContacto(name, email, comment, ip, fecha, pais);
            // Send notification email
            sendNotificationEmail(name, email, pais, ip);
            // Redirect to contactos page
            res.redirect('/contactos');
        } catch (err) {
            console.error(err);
            res.status(500).send("Error al guardar el contacto");
        }
    }

    async getAll(req, res) {
        try {
            // Fetch all contacts
            const contacts = await this.contactosModel.obtenerAllContactos();
            // Render contactos view with contacts data
            res.render('contactos', { contacts });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error al obtener los contactos");
        }
    }
}

module.exports = ContactosController;
