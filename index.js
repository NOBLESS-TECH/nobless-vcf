const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 5,
  message: { error: 'TOO_MANY_REQUESTS' },
  standardHeaders: true, legacyHeaders: false,
});
const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, max: 10,
  message: { error: 'TOO_MANY_REQUESTS' },
});

const contactRoutes = require('./routes/contacts');
app.use('/api/register', registerLimiter);
app.use('/api/download', downloadLimiter);
app.use('/api', contactRoutes);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });
