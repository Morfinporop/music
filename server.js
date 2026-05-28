require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require('discord.js');
const { Player, useQueue } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { Track, Config } = require('./models');

// 1. ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/soundforge';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ База данных подключена'))
  .catch(err => console.error('❌ Ошибка БД:', err));

// 2. НАСТРОЙКА DISCORD БОТА
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const player = new Player(client);
player.extractors.loadMulti(DefaultExtractors);

// Функция создания кнопок (VK Style)
function createPlayerButtons(isPaused = false) {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('player_prev').setEmoji('⏮️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(isPaused ? 'player_resume' : 'player_pause').setEmoji(isPaused ? '▶️' : '⏸️').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('player_skip').setEmoji('⏭️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('player_stop').setEmoji('⏹️').setStyle(ButtonStyle.Danger),
  );
  return [row];
}

// Событие: начало трека
player.events.on('playerStart', (queue, track) => {
  const embed = new EmbedBuilder()
    .setColor(0x0ea5e9)
    .setTitle(track.title)
    .setDescription(`**${track.author}**`)
    .setThumbnail(track.thumbnail)
    .setFooter({ text: `Громкость: ${queue.node.volume}%` });

  queue.metadata.channel.send({ embeds: [embed], components: createPlayerButtons(false) });
});

// 3. API ДЛЯ ПАНЕЛИ УПРАВЛЕНИЯ
const app = express();
app.use(cors());
app.use(express.json());

// API: Получить все треки из БД
app.get('/api/tracks', async (req, res) => {
  const tracks = await Track.find().sort({ addedAt: -1 });
  res.json(tracks);
});

// API: Добавить трек в БД
app.post('/api/tracks', async (req, res) => {
  const track = new Track(req.body);
  await track.save();
  res.json(track);
});

// API: Статус бота
app.get('/api/status', (req, res) => {
  res.json({
    online: client.isReady(),
    guilds: client.guilds.cache.size,
    uptime: process.uptime(),
  });
});

// Раздача фронтенда (React)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 4. ЗАПУСК
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
});

if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN);
} else {
  console.error('⚠️ DISCORD_TOKEN не найден в Variables!');
}

// Обработка кнопок
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  const queue = useQueue(interaction.guild.id);
  if (!queue) return;

  if (interaction.customId === 'player_pause') {
    queue.node.pause();
    await interaction.update({ components: createPlayerButtons(true) });
  } else if (interaction.customId === 'player_resume') {
    queue.node.resume();
    await interaction.update({ components: createPlayerButtons(false) });
  } else if (interaction.customId === 'player_skip') {
    queue.node.skip();
    await interaction.reply({ content: '⏭️ Пропущено', ephemeral: true });
  } else if (interaction.customId === 'player_stop') {
    queue.delete();
    await interaction.update({ content: '⏹️ Остановлено', embeds: [], components: [] });
  }
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Бот ${client.user.tag} в сети!`);
});
