import express from 'express';
import cors from 'cors';
import { kv } from '@vercel/kv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const initialNews = [
  // === ORTA ASYA ===
  { id: 1, region: 'central-asia', title: 'ICWC 91. Toplantisi: 2025-2026 Su Tahsisleri Onaylandi', date: '2025-11-15', country: 'Turkmenistan', lat: 37.9608, lng: 58.3261, description: 'Askabat\'ta Amu Derya icin 55,4 milyar m3 limit belirlendi.', emoji: '\uD83C\uDDF9\uD83C\uDDF2', color: '#10b981' },
  { id: 3, region: 'central-asia', title: 'Kuzey Aral Golu Hacmi 23 milyar m3e Yukseldi', date: '2026-03-10', country: 'Kazakistan', lat: 46.05, lng: 59.6, description: 'Kokaral Baraji 2. fazi tamamlandi.', emoji: '\uD83C\uDDF0\uD83C\uDDFF', color: '#10b981' },
  // === ARAP ULKELERI ===
  { id: 9, region: 'arab', title: 'Misir-Sudan-Etiyopya: GERD Muzakereleri Yeniden Basladi', date: '2026-02-10', country: 'Misir', lat: 30.0444, lng: 31.2357, description: 'Nil suyu paylasimi masada.', emoji: '\uD83C\uDDEA\uD83C\uDDEC', color: '#f59e0b' },
  { id: 11, region: 'arab', title: 'Suudi Arabistan: Neom Deniz Suyu Aritma Kapasitesi Artti', date: '2026-03-05', country: 'Suudi Arabistan', lat: 24.7136, lng: 46.6753, description: 'Günlük 500 milyon litre kapasiteli tesis.', emoji: '\uD83C\uDDF8\uD83C\uDDE6', color: '#0ea5e9' },
  // === AFRIKA ===
  { id: 19, region: 'africa', title: 'Sudan: Buyuk Sahra Su Rezervuarlari Arastirmasi', date: '2026-04-05', country: 'Sudan', lat: 15.5007, lng: 32.5599, description: 'Nubian Sandstone Aquifer uzerindeki yeni sondaj verileri paylasildi.', emoji: '\uD83C\uDDF8\uD83C\uDDE9', color: '#10b981' },
  { id: 20, region: 'africa', title: 'Guney Afrika: Cape Town Yeni Su Yonetim Sistemi', date: '2026-03-12', country: 'Guney Afrika', lat: -33.9249, lng: 18.4241, description: 'Day Zero riskini onlemek icin AI tabanli su dagitim agi devreye girdi.', emoji: '\uD83C\uDDFF\uD83C\uDDE6', color: '#8b5cf6' },
  { id: 21, region: 'africa', title: 'Nijerya: Cad Golu Restorasyon Girisimi', date: '2026-02-28', country: 'Nijerya', lat: 9.0820, lng: 8.6753, description: 'Cad Golu\'nun canlandirilmasi icin 5 ulke ortak fon kurdu.', emoji: '\uD83C\uDDF3\uD83C\uDDEC', color: '#ef4444' },
  { id: 22, region: 'africa', title: 'Etiyopya: GERD 4. Faz Elektrik Uretimi', date: '2026-01-20', country: 'Etiyopya', lat: 9.0300, lng: 38.7400, description: 'Nil uzerindeki dev barajda 2 yeni turbin aktif hale getirildi.', emoji: '\uD83C\uDDEA\uD83C\uDDF9', color: '#f59e0b' },
  { id: 23, region: 'africa', title: 'Kenya: Tana Nehri Sulama Kanallari Modernizasyonu', date: '2026-03-25', country: 'Kenya', lat: -1.2921, lng: 36.8219, description: 'Dogu Afrika\'nin en buyuk sulama projesi tamamlandi.', emoji: '\uD83C\uDDF0\uD83C\uDDEA', color: '#3b82f6' },
  { id: 24, region: 'africa', title: 'Kongo: Congo Nehri Hidroelektrik Potansiyeli', date: '2026-04-01', country: 'Kongo', lat: -4.2634, lng: 15.2422, description: 'Grand Inga Baraji projesinde yeni finansman anlasmasi.', emoji: '\uD83C\uDDE8\uD83C\uDDE9', color: '#06b6d4' },
  { id: 25, region: 'africa', title: 'Fas: Afrika\'nin En Buyuk Tuzdan Aritma Tesisi', date: '2026-02-15', country: 'Fas', lat: 33.9716, lng: -6.8498, description: 'Kazablanka bolgesindeki tesis insaati hizlandirildi.', emoji: '\uD83C\uDDF2\uD83C\uDDE6', color: '#0ea5e9' },
  { id: 26, region: 'africa', title: 'Botsvana-Namibya: Okavango Havzasi Koruma Plani', date: '2026-03-08', country: 'Botsvana', lat: -24.6282, lng: 25.9231, description: 'Dunyanin en buyuk ic deltasi icin eko-turizm ve su yonetim anlasmasi.', emoji: '\uD83C\uDDE7\uD83C\uDDFC', color: '#10b981' },
  { id: 27, region: 'africa', title: 'Cezayir: Sahra Alti Su Tasima Hatti', date: '2026-01-10', country: 'Cezayir', lat: 36.7538, lng: 3.0588, description: 'Gneydeki rezervuarlardan kuzey sehirlerine su tasiyan 1000 kmlik hat tamamlandi.', emoji: '\uD83C\uDDE9\uD83C\uDDFF', color: '#8b5cf6' },
  { id: 28, region: 'africa', title: 'Angola: Kunene Nehri Taskin Kontrol Sistemi', date: '2026-03-20', country: 'Angola', lat: -8.8390, lng: 13.2894, description: 'Ilim degisikligine karsi erken uyari sensorleri yerlestirildi.', emoji: '\uD83C\uDDE6\uD83C\uDDF4', color: '#ef4444' }
];

async function getNews() {
  try {
    let news = await kv.get('news');
    if (!news) { await kv.set('news', initialNews); news = initialNews; }
    return news;
  } catch (e) { return initialNews; }
}

async function setNews(news) {
  await kv.set('news', news);
}

app.get('/api/news', async (req, res) => {
  const news = await getNews();
  const region = req.query.region;
  if (region && region !== 'all') {
    return res.json(news.filter(n => n.region === region));
  }
  res.json(news);
});

app.post('/api/news', async (req, res) => {
  const news = await getNews();
  const newItem = { id: Date.now(), date: new Date().toISOString().split('T')[0], region: req.body.region || 'all', ...req.body };
  news.unshift(newItem);
  await setNews(news);
  res.status(201).json(newItem);
});

app.get('/api/cron-weekly', async (req, res) => {
  const news = await getNews();
  const newWeekly = {
    id: Date.now(),
    region: 'all',
    title: 'Haftalik Guncelleme: Kuresel Su Yonetimi',
    date: new Date().toISOString().split('T')[0],
    country: 'Global',
    lat: 20 + (Math.random() * 40 - 20),
    lng: 30 + (Math.random() * 60 - 30),
    description: 'Otomatik cron guncellemesi.',
    emoji: '\uD83D\uDD04',
    color: '#64748b'
  };
  news.unshift(newWeekly);
  await setNews(news);
  res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
