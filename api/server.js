const app = require('./app');
const seedDemoUsers = require('./utils/seed');

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, async () => {
        console.log(`Serveur Collector démarré sur le port ${PORT}`);
        await seedDemoUsers();
    });
}

module.exports = app;
