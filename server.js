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
  { id: 1, title: 'ICWC 91. Toplantisi: 2025-2026 Su Tahsisleri Onaylandi', date: '2025-11-15', country: 'Turkmenistan', lat: 37.9608, lng: 58.3261, description: 'Askabat\'ta Amu Derya icin 55,4 milyar m3, Sir Derya icin 4,219 milyar m3 limit belirlendi.', emoji: '\uD83C\uDDF9\uD83C\uDDF2', color: '#10b981' },
  { id: 2, title: 'Kazakistan-Kirgizistan-Ozbekistan Su-Enerji Takasi Anlasma', date: '2025-09-22', country: 'Kirgizistan', lat: 41.8, lng: 72.95, description: 'Toktogul Rezervuarindan yaz sulama suyu - Kis elektrik takasi protokolu imzalandi.', emoji: '\uD83C\uDDF0\uD83C\uDDEC', color: '#3b82f6' },
  { id: 3, title: 'Kuzey Aral Golu Hacmi 23 milyar m3e Yukseldi', date: '2026-03-10', country: 'Kazakistan', lat: 46.05, lng: 59.6, description: 'Kokaral Baraji 2. fazi tamamlandi. Balikcilik canaldi, tuz firtinalari azaldi.', emoji: '\uD83C\uDDF0\uD83C\uDDFF', color: '#10b981' },
  { id: 4, title: 'Kazakistan-Ozbekistan Sinir Otesi Su Anlasmas Onaylandi', date: '2026-03-28', country: 'Ozbekistan', lat: 41.2995, lng: 69.2401, description: 'Sir Derya uzerindeki ortak yonetim protokolu Mart 2026da Ozbekistan tarafindan onaylandi.', emoji: '\uD83C\uDDFA\uD83C\uDDFF', color: '#8b5cf6' },
  { id: 5, title: 'Astana Bolgesel Ekolojik Zirvesi RES 2026 22-24 Nisan', date: '2026-04-20', country: 'Kazakistan', lat: 51.1694, lng: 71.4491, description: 'Aral Golu restorasyonu, dijital su izleme ve 2026-2036 Akilci Su Kullanimi On Yili gundemde.', emoji: '\uD83C\uDDF0\uD83C\uDDFF', color: '#10b981' },
  { id: 6, title: 'Ozbekistan 3 Yillik Su Tasarrufu Programi Basladi', date: '2025-08-12', country: 'Ozbekistan', lat: 41.2995, lng: 69.2401, description: '2.500 km kanal modernizasyonu ile 2028e kadar 10-14 milyar m3 tasarruf hedefleniyor.', emoji: '\uD83C\uDDFA\uD83C\uDDFF', color: '#8b5cf6' },
  { id: 7, title: 'Tacikistan Bahri Tojik Rezervuari Uclu Anlasma', date: '2025-10-05', country: 'Tacikistan', lat: 38.5598, lng: 68.787, description: 'Kazakistan-Tacikistan-Ozbekistan arasinda rezervuar rejimi koordinasyonu saglandi.', emoji: '\uD83C\uDDF9\uD83C\uDDEF', color: '#ec4899' },
  { id: 8, title: 'Kirgizistan Havza Konseyleri Kuruldu', date: '2026-02-18', country: 'Kirgizistan', lat: 42.8746, lng: 74.5698, description: 'Talas ve Naryn-Syr Darya havza konseyleri aktif hale getirildi.', emoji: '\uD83C\uDDF0\uD83C\uDDEC', color: '#3b82f6' }
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
  res.json(news);
});

app.post('/api/news', async (req, res) => {
  const news = await getNews();
  const newItem = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...req.body };
  news.unshift(newItem);
  await setNews(news);
  res.status(201).json(newItem);
});

app.get('/api/cron-weekly', async (req, res) => {
  console.log('[VERCEL CRON] Haftalik guncelleme calisiyor...');
  const news = await getNews();
  const newWeekly = {
    id: Date.now(),
    title: 'Haftalik Guncelleme: Yeni Su Diplomasisi Gelismesi (Otomatik)',
    date: new Date().toISOString().split('T')[0],
    country: 'Bolgesel',
    lat: 44.5 + (Math.random() * 4 - 2),
    lng: 68 + (Math.random() * 8 - 4),
    description: 'Bu haber Vercel Cron ile otomatik eklendi.',
    emoji: '\uD83D\uDD04',
    color: '#64748b'
  };
  news.unshift(newWeekly);
  await setNews(news);
  res.json({ status: 'success', message: 'Haftalik haber eklendi' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));

export default app;
