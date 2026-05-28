const mongoose = require('mongoose');

// Схема для песен в библиотеке
const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: 'Неизвестен' },
  duration: { type: Number, default: 0 },
  source: { type: String, default: 'url' },
  url: String,
  addedAt: { type: Date, default: Date.now },
  fileSize: Number
});

// Схема для конфигурации бота
const configSchema = new mongoose.Schema({
  key: { type: String, default: 'bot_config', unique: true },
  prefix: { type: String, default: '/' },
  volume: { type: Number, default: 50 },
  leaveOnEmpty: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: false },
  leaveTimeout: { type: Number, default: 60 }
});

const Track = mongoose.model('Track', trackSchema);
const Config = mongoose.model('Config', configSchema);

module.exports = { Track, Config };
