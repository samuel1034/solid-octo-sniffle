const axios = require('axios');
const ContactosModel = require("../models/ContactosModel");
const sendNotificationEmail = require('../utils/email');

class ContactosController {
    constructor(){
        this.contactosModel = new ContactosModel();
        this.add = this.add.bind(this);
    }

    async add(req, res) {
        // Validar los datos del formulario
        const { name, email, comment, pais } = req.body;
      
        if (!name ||!email ||!comment) {
          res.status(400).send("Faltan campos requeridos");
          return;
        }
      
        // Get the user's IP address from the request object
        const ip = req.ip;
      
        //Guardar los datos del formulario
        const fecha = new Date().toISOString();
      
        await this.contactosModel.crearContacto(name, email, comment, ip, fecha);
      
        // Enviar correo electrónico de notificación
        sendNotificationEmail(name, email, pais, ip);
      
        res.send("Formulario enviado con éxito");
      }
}


module.exports = ContactosController;
