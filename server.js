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
  { id: 1, region: 'central-asia', title: 'ICWC 91. Toplantisi: 2025-2026 Su Tahsisleri Onaylandi', date: '2025-11-15', country: 'Turkmenistan', lat: 37.95, lng: 58.38, description: 'Bölgesel su paylaşım kotası belirlendi.', url: 'https://www.unwater.org/', emoji: '💧', color: '#3498db' },
  { id: 3, region: 'central-asia', title: 'Kuzey Aral Golu Hacmi 23 milyar m3e Yukseldi', date: '2026-03-10', country: 'Kazakistan', lat: 46.05, lng: 61.65, description: 'Baraj projeleri sayesinde göl seviyesi artıyor.', url: 'https://www.unwater.org/', emoji: '🌊', color: '#3498db' },
  // === ARAP ULKELERI ===
  { id: 9, region: 'arab', title: 'Misir-Sudan-Etiyopya: GERD Muzakereleri Yeniden Basladi', date: '2026-02-10', country: 'Misir', lat: 30.0444, lng: 31.2357, description: 'Nil sularının paylaşımı için kritik zirve.', url: 'https://www.aljazeera.com/', emoji: '🇪🇬', color: '#e74c3c' },
  { id: 11, region: 'arab', title: 'Suudi Arabistan: Neom Deniz Suyu Aritma Kapasitesi Artti', date: '2026-03-05', country: 'Suudi Arabistan', lat: 24.7136, lng: 46.6753, description: 'Güneş enerjili arıtma tesisleri devreye girdi.', url: 'https://www.unwater.org/', emoji: '🇸🇦', color: '#e74c3c' },
  // === AFRIKA ===
  { id: 19, region: 'africa', title: 'Sudan: Buyuk Sahra Su Rezervuarlari Arastirmasi', date: '2026-04-05', country: 'Sudan', lat: 15.5007, lng: 32.5599, description: 'Yeraltı su kaynakları haritalanıyor.', url: 'https://www.unwater.org/', emoji: '🌍', color: '#e67e22' },
  { id: 20, region: 'africa', title: 'Guney Afrika: Cape Town Yeni Su Yonetim Sistemi', date: '2026-03-12', country: 'Guney Afrika', lat: -33.9249, lng: 18.4232, description: 'Kuraklık riskine karşı dijital takip.', url: 'https://www.bbc.com/news', emoji: '🇿🇦', color: '#e67e22' },
  { id: 21, region: 'africa', title: 'Nijerya: Cad Golu Restorasyon Girisimi', date: '2026-02-28', country: 'Nijerya', lat: 9.0820, lng: 8.6753, description: 'Gölün küçülmesini engelleme projesi.', url: 'https://www.unwater.org/', emoji: '🇳🇬', color: '#e67e22' },
  { id: 22, region: 'africa', title: 'Etiyopya: GERD 4. Faz Elektrik Uretimi', date: '2026-01-20', country: 'Etiyopya', lat: 9.0300, lng: 38.7400, description: 'Barajın tam kapasiteye ulaşması bekleniyor.', url: 'https://www.aljazeera.com/', emoji: '🇪🇹', color: '#e67e22' },
  // === AVRUPA ===
  { id: 30, region: 'europe', title: 'Ispanya: Katalonya\'da Tarihi Kuraklik Onlemleri', date: '2026-05-15', country: 'Ispanya', lat: 41.3851, lng: 2.1734, description: 'Su kullanımına kısıtlamalar getirildi.', url: 'https://www.elpais.com/', emoji: '🇪🇸', color: '#27ae60' },
  { id: 32, region: 'europe', title: 'Italya: Po Ovasi Sulama Modernizasyonu', date: '2026-04-22', country: 'Italya', lat: 45.0703, lng: 7.6869, description: 'Tarımda akıllı su yönetimi.', url: 'https://www.ansa.it/', emoji: '🇮🇹', color: '#27ae60' },
  // === AMERIKA ===
  { id: 40, region: 'america', title: 'Brezilya: Amazon Havzasi Koruma Programi', date: '2026-06-05', country: 'Brezilya', lat: -3.4653, lng: -62.2159, description: 'Nehir ekosistemini korumak için yeni yasalar.', url: 'https://www.globo.com/', emoji: '🇧🇷', color: '#f1c40f' },
  { id: 41, region: 'america', title: 'ABD: Colorado Nehri Su Paylasim Anlasmasi', date: '2026-03-20', country: 'ABD', lat: 36.1699, lng: -115.1398, description: '7 eyalet arasında yeni kotalar belirlendi.', url: 'https://www.nytimes.com/', emoji: '🇺🇸', color: '#f1c40f' },
  { id: 42, region: 'america', title: 'Kanada: Arktik Su Kaynaklari Gozlemi', date: '2026-04-15', country: 'Kanada', lat: 60.0000, lng: -95.0000, description: 'Buzul erimesinin tatlı su kaynaklarına etkisi.', url: 'https://www.cbc.ca/', emoji: '🇨🇦', color: '#f1c40f' },
  { id: 43, region: 'america', title: 'Arjantin-Paraguay: Parana Nehri Seviye Takibi', date: '2026-02-10', country: 'Arjantin', lat: -34.6037, lng: -58.3816, description: 'Lojistik ve tarım için kritik su seviyesi uyarısı.', url: 'https://www.clarin.com/', emoji: '🇦🇷', color: '#f1c40f' },
  { id: 44, region: 'america', title: 'Meksika: Mexico City Yeralti Su Rezervi Projesi', date: '2026-05-20', country: 'Meksika', lat: 19.4326, lng: -99.1332, description: 'Şehrin su krizine karşı devasa sarnıçlar.', url: 'https://www.eluniversal.com.mx/', emoji: '🇲🇽', color: '#f1c40f' }
];

async function getNews() {
  try {
    const news = await kv.get('water_news');
    return news || initialNews;
  } catch (err) {
    console.error('KV Error, falling back to initialNews:', err);
    return initialNews;
  }
}

async function setNews(news) {
  try {
    await kv.set('water_news', news);
  } catch (err) {
    console.error('KV Error, cannot set news:', err);
  }
}

app.get('/api/news', async (req, res) => {
  const news = await getNews();
  res.json(news);
});

app.post('/api/news', async (req, res) => {
  const news = await getNews();
  const newItem = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    region: req.body.region || 'all',
    ...req.body
  };
  news.unshift(newItem);
  await setNews(news);
  res.status(201).json(newItem);
});

app.get('/api/cron-weekly', async (req, res) => {
  const news = await getNews();
  const regions = ['central-asia', 'arab', 'africa', 'europe', 'america'];
  const randReg = regions[Math.floor(Math.random() * regions.length)];
  const newWeekly = {
    id: Date.now(),
    region: randReg,
    title: 'Haftalik Guncelleme: Bolgesel Su Yonetimi Gelismesi',
    date: new Date().toISOString().split('T')[0],
    country: 'Global',
    lat: 40 + (Math.random() * 20 - 10),
    lng: -40 + (Math.random() * 80 - 40),
    description: 'Otomatik haber guncellemesi.',
    url: 'https://www.unwater.org/',
    emoji: '💧',
    color: '#64748b'
  };
  news.unshift(newWeekly);
  await setNews(news);
  res.json({ status: 'success' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
