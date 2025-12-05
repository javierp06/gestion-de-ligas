const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            console.warn('MONGODB_URI no está definido en las variables de entorno. MongoDB no se conectará.');
            return;
        }

        await mongoose.connect(uri);

        console.log('MongoDB conectado correctamente');

        mongoose.connection.on('error', (err) => {
            console.error('Error en MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB desconectado');
        });

    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        console.log('La aplicación continuará sin MongoDB (logs y comentarios deshabilitados)');
        // No hacemos exit para que la app funcione sin MongoDB
    }
};

module.exports = { connectMongoDB };
