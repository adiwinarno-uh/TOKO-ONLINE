/* ==========================================================
   DATA TOKO DAN PRODUK
   File ini yang paling sering Anda ubah.
   ========================================================== */

// 1) Informasi toko. Ganti dengan data toko Anda.
const KONFIG = {
  nama: "ATHAFARIZ RADEYA FADHIL",
  tagline: "Kebutuhan harian, lengkap dalam satu toko",
  // Nomor WhatsApp: kode negara tanpa tanda + dan tanpa 0 di depan.
  // Contoh: 0812-3456-7890 ditulis 6281234567890
  nomorWA: "6285267553229",
  alamat: "Purwa Agung, Kecamatan Negara Batin,Kabupaten Way Kanan, Provinsi Lampung",
  jamBuka: "Setiap hari, 07.00 sampai 21.00"
};

// 2) Kategori. "id" harus sama dengan kolom "kategori" di daftar produk.
const KATEGORI = [
  { id: "sembako",    nama: "Sembako" },
  { id: "makanan",    nama: "Makanan & Minuman" },
  { id: "kebersihan", nama: "Kebersihan" },
  { id: "alat-tulis", nama: "Alat Tulis" },
  { id: "rumah",      nama: "Peralatan Rumah" }
];

// 3) Daftar produk.
//    id        : nomor unik, jangan sama antar produk
//    harga     : angka saja, tanpa titik (18000, bukan 18.000)
//    hargaAsli : opsional, isi kalau sedang diskon (harga coret)
//    emoji     : gambar sementara
//    gambar    : opsional, jalur foto produk, misalnya "gambar/beras.jpg".
//                Kalau diisi, foto dipakai menggantikan emoji.
const PRODUK = [
  // Sembako
  { id: 1,  nama: "Beras Pulen 5 kg",       satuan: "per karung",      harga: 68000, hargaAsli: 72000, kategori: "sembako", emoji: "🍚", gambar: "" },
  { id: 2,  nama: "Minyak Goreng 1 L",      satuan: "per pouch",       harga: 18000, kategori: "sembako", emoji: "🛢️", gambar: "" },
  { id: 3,  nama: "Gula Pasir 1 kg",        satuan: "per kemasan",     harga: 17500, kategori: "sembako", emoji: "🍬", gambar: "" },
  { id: 4,  nama: "Telur Ayam",             satuan: "per kg",          harga: 29000, kategori: "sembako", emoji: "🥚", gambar: "" },
  { id: 5,  nama: "Tepung Terigu 1 kg",     satuan: "per kemasan",     harga: 13000, kategori: "sembako", emoji: "🌾", gambar: "" },
  { id: 6,  nama: "Garam Dapur 250 g",      satuan: "per bungkus",     harga: 4000,  kategori: "sembako", emoji: "🧂", gambar: "" },
  { id: 7,  nama: "Mi Instan Goreng",       satuan: "isi 5 bungkus",   harga: 16500, kategori: "sembako", emoji: "🍜", gambar: "" },

  // Makanan & Minuman
  { id: 8,  nama: "Air Mineral 600 ml",     satuan: "isi 12 botol",    harga: 32000, kategori: "makanan", emoji: "💧", gambar: "" },
  { id: 9,  nama: "Teh Celup",              satuan: "isi 25 kantong",  harga: 9500,  kategori: "makanan", emoji: "🍵", gambar: "" },
  { id: 10, nama: "Kopi Bubuk 200 g",       satuan: "per bungkus",     harga: 22000, hargaAsli: 24500, kategori: "makanan", emoji: "☕", gambar: "" },
  { id: 11, nama: "Susu UHT Cokelat 200 ml", satuan: "per kotak",      harga: 6500,  kategori: "makanan", emoji: "🥛", gambar: "" },
  { id: 12, nama: "Biskuit Kelapa",         satuan: "per bungkus",     harga: 11000, kategori: "makanan", emoji: "🍪", gambar: "" },
  { id: 13, nama: "Keripik Singkong",       satuan: "per bungkus",     harga: 12000, kategori: "makanan", emoji: "🥔", gambar: "" },
  { id: 14, nama: "Roti Tawar",             satuan: "per bungkus",     harga: 16000, kategori: "makanan", emoji: "🍞", gambar: "" },

  // Kebersihan
  { id: 15, nama: "Sabun Mandi Batang",     satuan: "per buah",        harga: 4500,  kategori: "kebersihan", emoji: "🧼", gambar: "" },
  { id: 16, nama: "Sampo 170 ml",           satuan: "per botol",       harga: 19000, kategori: "kebersihan", emoji: "🧴", gambar: "" },
  { id: 17, nama: "Deterjen Bubuk 800 g",   satuan: "per bungkus",     harga: 21000, hargaAsli: 23000, kategori: "kebersihan", emoji: "🧺", gambar: "" },
  { id: 18, nama: "Pasta Gigi 120 g",       satuan: "per tube",        harga: 13500, kategori: "kebersihan", emoji: "🪥", gambar: "" },
  { id: 19, nama: "Sabun Cuci Piring 400 ml", satuan: "per pouch",     harga: 10500, kategori: "kebersihan", emoji: "🫧", gambar: "" },
  { id: 20, nama: "Tisu Wajah",             satuan: "per kotak",       harga: 12500, kategori: "kebersihan", emoji: "🧻", gambar: "" },

  // Alat Tulis
  { id: 21, nama: "Buku Tulis 38 Lembar",   satuan: "isi 10 buku",     harga: 32000, kategori: "alat-tulis", emoji: "📒", gambar: "" },
  { id: 22, nama: "Pulpen Hitam",           satuan: "isi 12 pcs",      harga: 18000, kategori: "alat-tulis", emoji: "🖊️", gambar: "" },
  { id: 23, nama: "Pensil 2B",              satuan: "isi 12 pcs",      harga: 15000, kategori: "alat-tulis", emoji: "✏️", gambar: "" },
  { id: 24, nama: "Penggaris 30 cm",        satuan: "per buah",        harga: 5000,  kategori: "alat-tulis", emoji: "📏", gambar: "" },
  { id: 25, nama: "Gunting Kertas",         satuan: "per buah",        harga: 9000,  kategori: "alat-tulis", emoji: "✂️", gambar: "" },

  // Peralatan Rumah
  { id: 26, nama: "Lampu LED 9 Watt",       satuan: "per buah",        harga: 15000, kategori: "rumah", emoji: "💡", gambar: "" },
  { id: 27, nama: "Baterai AA",             satuan: "isi 4 pcs",       harga: 14000, kategori: "rumah", emoji: "🔋", gambar: "" },
  { id: 28, nama: "Sapu Lantai",            satuan: "per buah",        harga: 25000, kategori: "rumah", emoji: "🧹", gambar: "" },
  { id: 29, nama: "Ember 10 L",             satuan: "per buah",        harga: 17000, kategori: "rumah", emoji: "🪣", gambar: "" },
  { id: 30, nama: "Kabel Charger USB",      satuan: "per buah",        harga: 25000, hargaAsli: 30000, kategori: "rumah", emoji: "🔌", gambar: "" }
];
