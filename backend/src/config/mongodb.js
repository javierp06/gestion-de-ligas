const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://javierp191999_db_user:DbWqAZvSswMLgE5l@cluster0.15fh0s2.mongodb.net/deportes_logs';

        // Configuración sin opciones deprecadas
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
