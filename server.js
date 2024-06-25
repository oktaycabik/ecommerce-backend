const express = require('express');
const prometheus = require('prom-client');
const connectDB = require('./config/db');
const routers = require("./routes/index");

const app = express();
const port = 3000;

// Veritabanı Bağlantısı
connectDB();

// Middleware
app.use(express.json());


// Prometheus metriklerini kaydedecek registry oluştur
const register = new prometheus.Registry();

// Varsayılan metriklerin toplanmasını etkinleştir
prometheus.collectDefaultMetrics({ register });

// Metrikleri örneklemek için özel bir sayaç oluştur
const apiRequestCounter = new prometheus.Counter({
  name: 'api_requests_total',
  help: 'Total number of API requests',
  labelNames: ['endpoint'],
  registers: [register],
});

const httpRequestDurationHistogram = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// Middleware tanımlamaları
app.use((req, res, next) => {
  // Her istekte Counter'ı artırma
  apiRequestCounter.labels(req.path).inc();
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Histogram metriği güncelleme
    httpRequestDurationHistogram.observe(duration / 1000);
  });
  next();
});

app.use("/api", routers);


// /metrics endpoint'i Prometheus için metrikleri sunar
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Express sunucusunu başlat
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
