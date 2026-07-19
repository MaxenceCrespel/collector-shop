const express = require('express');
const promClient = require('prom-client');

promClient.collectDefaultMetrics({ timeout: 5000 });

const router = express.Router();

router.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

module.exports = router;
