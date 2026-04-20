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
  { id: 1, region: 'central-asia', title: 'ICWC 91. Toplantisi: 2025-2026 Su Tahsisleri Onaylandi', date: '2025-11-15', country: 'Turkmenistan', lat: 37.9608, lng: 58.3261, description: 'Askabat\'ta Amu Derya icin 55,4 milyar m3, Sir Derya icin 4,219 milyar m3 limit belirlendi.', emoji: '\uD83C\uDDF9\uD83C\uDDF2', color: '#10b981' },
  { id: 2, region: 'central-asia', title: 'Kazakistan-Kirgizistan-Ozbekistan Su-Enerji Takasi', date: '2025-09-22', country: 'Kirgizistan', lat: 41.8, lng: 72.95, description: 'Toktogul Rezervuarindan yaz sulama suyu - Kis elektrik takasi protokolu imzalandi.', emoji: '\uD83C\uDDF0\uD83C\uDDEC', color: '#3b82f6' },
  { id: 3, region: 'central-asia', title: 'Kuzey Aral Golu Hacmi 23 milyar m3e Yukseldi', date: '2026-03-10', country: 'Kazakistan', lat: 46.05, lng: 59.6, description: 'Kokaral Baraji 2. fazi tamamlandi. Balikcilik canaldi, tuz firtinalari azaldi.', emoji: '\uD83C\uDDF0\uD83C\uDDFF', color: '#10b981' },
  { id: 4, region: 'central-asia', title: 'Kazakistan-Ozbekistan Sinir Otesi Su Anlasmas Onaylandi', date: '2026-03-28', country: 'Ozbekistan', lat: 41.2995, lng: 69.2401, description: 'Sir Derya uzerindeki ortak yonetim protokolu Mart 2026da onaylandi.', emoji: '\uD83C\uDDFA\uD83C\uDDFF', color: '#8b5cf6' },
  { id: 5, region: 'central-asia', title: 'Astana Bolgesel Ekolojik Zirvesi RES 2026', date: '2026-04-20', country: 'Kazakistan', lat: 51.1694, lng: 71.4491, description: 'Aral Golu restorasyonu, dijital su izleme ve 2026-2036 Akilci Su Kullanimi On Yili gundemde.', emoji: '\uD83C\uDDF0\uD83C\uDDFF', color: '#10b981' },
  { id: 6, region: 'central-asia', title: 'Ozbekistan 3 Yillik Su Tasarrufu Programi', date: '2025-08-12', country: 'Ozbekistan', lat: 41.2995, lng: 69.2401, description: '2.500 km kanal modernizasyonu ile 2028e kadar 10-14 milyar m3 tasarruf hedefleniyor.', emoji: '\uD83C\uDDFA\uD83C\uDDFF', color: '#8b5cf6' },
  { id: 7, region: 'central-asia', title: 'Tacikistan Bahri Tojik Rezervuari Uclu Anlasma', date: '2025-10-05', country: 'Tacikistan', lat: 38.5598, lng: 68.787, description: 'Kazakistan-Tacikistan-Ozbekistan arasinda rezervuar rejimi koordinasyonu saglandi.', emoji: '\uD83C\uDDF9\uD83C\uDDEF', color: '#ec4899' },
  { id: 8, region: 'central-asia', title: 'Kirgizistan Havza Konseyleri Kuruldu', date: '2026-02-18', country: 'Kirgizistan', lat: 42.8746, lng: 74.5698, description: 'Talas ve Naryn-Syr Darya havza konseyleri aktif hale getirildi.', emoji: '\uD83C\uDDF0\uD83C\uDDEC', color: '#3b82f6' },
  // === ARAP ULKELERI ===
  { id: 9, region: 'arab', title: 'Misir-Sudan-Etiyopya: GERD Muzakereleri Yeniden Basladi', date: '2026-02-10', country: 'Misir', lat: 30.0444, lng: 31.2357, description: 'Buyuk Etiyopya Rontaj Baraji (GERD) konusunda Kahire\'de uc tarafli gorusme yapildi. Nil suyu paylasimi masada.', emoji: '\uD83C\uDDEA\uD83C\uDDEC', color: '#f59e0b' },
  { id: 10, region: 'arab', title: 'Irak: Dicle ve Firat Debisi Yuzde 40 Dustu', date: '2026-01-15', country: 'Irak', lat: 33.3152, lng: 44.3661, description: 'Turkiye ve Iran barajlarinin etkisiyle Dicle-Firat havzasinda tarihi dusuk deb kaydedildi. Gubre krizine yol acti.', emoji: '\uD83C\uDDEE\uD83C\uDDF6', color: '#ef4444' },
  { id: 11, region: 'arab', title: 'Suudi Arabistan: Neom Projesi Deniz Suyu Aritma Kapasitesi 2 Katina Cikti', date: '2026-03-05', country: 'Suudi Arabistan', lat: 24.7136, lng: 46.6753, description: 'NEOM bolgesinde gunluk 500 milyon litre kapasiteli tuzdan aritma tesisi devreye girdi.', emoji: '\uD83C\uDDF8\uD83C\uDDE6', color: '#0ea5e9' },
  { id: 12, region: 'arab', title: 'Urdun: Ulusal Su Stratejisi 2026-2035 Aciklandi', date: '2026-01-28', country: 'Urdun', lat: 31.9454, lng: 35.9284, description: 'Dunyanin en su fakiri ulkelerinden Urdun, yuzde 30 su tasarrufu ve geri donusturulen su kullanimini hedefliyor.', emoji: '\uD83C\uDDEF\uD83C\uDDF4', color: '#8b5cf6' },
  { id: 13, region: 'arab', title: 'BAE: Yapay Yagmur Teknolojisinde Rekor - 2025te 200 Operasyon', date: '2025-12-20', country: 'BAE', lat: 24.4539, lng: 54.3773, description: 'Birleshik Arap Emirlikleri bulut tohumlama operasyonlarini yuzde 15 artirdi. Yapay yagis miktari 1,8 milyar m3e ulasti.', emoji: '\uD83C\uDDE6\uD83C\uDDEA', color: '#0ea5e9' },
  { id: 14, region: 'arab', title: 'Yemen: BM Su Acil Yardim Programi Genisledi', date: '2026-02-25', country: 'Yemen', lat: 15.5527, lng: 48.5164, description: 'BM OCHA, catisma bolgelerinde 4 milyon insana temiz su erisimi saglamak icin 180 milyon dolar acil fon acikladi.', emoji: '\uD83C\uDDFE\uD83C\uDDEA', color: '#ef4444' },
  { id: 15, region: 'arab', title: 'Lubnan: Litani Nehri Kirlilik Krizi', date: '2026-03-18', country: 'Lubnan', lat: 33.8547, lng: 35.8623, description: 'Litani Nehri\'nde amonyak seviyesi kritik esigi asti. Tarihsel kirlilik kaynaklari icin acil temizleme plani aciklandi.', emoji: '\uD83C\uDDF1\uD83C\uDDE7', color: '#f97316' },
  { id: 16, region: 'arab', title: 'Kuveyt-Irak: Satt ul-Arab Su Anlasmazligi Cozum Sureci', date: '2026-04-02', country: 'Kuveyt', lat: 29.3759, lng: 47.9774, description: 'Satt ul-Arab\'in denize dokulme noktasindaki tuz girisi sorununu cozmek icin ikili teknik komisyon kuruldu.', emoji: '\uD83C\uDDF0\uD83C\uDDFC', color: '#f59e0b' },
  { id: 17, region: 'arab', title: 'Suriye: Firat\'ta Su Seviyesi Kritik Duzeyde', date: '2026-01-05', country: 'Suriye', lat: 34.8021, lng: 38.9968, description: 'Firat Nehri\'nin Suriye bolumunde su seviyesi son 20 yilin en dusuk degerine geriledi; tarim krizi derinlesiyor.', emoji: '\uD83C\uDDF8\uD83C\uDDFE', color: '#ef4444' },
  { id: 18, region: 'arab', title: 'Katar: 2026 FIFA Sonrasi Su Altyapisi Mirasinin Sivil Kullanima Acilmasi', date: '2026-02-14', country: 'Katar', lat: 25.2854, lng: 51.53, description: 'Dunya Kupasi altyapisindan kalan dev tuzdan aritma ve gri su geri donusum tesisleri halka acildi.', emoji: '\uD83C\uDDF6\uD83C\uDDE6', color: '#10b981' }
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
  console.log('[VERCEL CRON] Haftalik guncelleme calisiyor...');
  const news = await getNews();
  const newWeekly = {
    id: Date.now(),
    region: 'all',
    title: 'Haftalik Guncelleme: Bolgesel Su Diplomasisi Gelismesi',
    date: new Date().toISOString().split('T')[0],
    country: 'Bolgesel',
    lat: 35 + (Math.random() * 20 - 10),
    lng: 45 + (Math.random() * 30 - 15),
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
