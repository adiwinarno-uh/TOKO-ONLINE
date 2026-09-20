/* ==========================================================
   LOGIKA TOKO
   Menampilkan produk, filter dan pencarian, keranjang, dan
   mengirim pesanan lewat WhatsApp.
   Data produk ada di produk.js.
   ========================================================== */
(function () {
  "use strict";

  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  });

  const KUNCI = "keranjang-toko-v1"; // nama simpanan di browser
  const MAKS = 99;                   // jumlah maksimal per barang

  const $ = (id) => document.getElementById(id);
  const el = {
    etalase: $("produk"), grid: $("grid"), chip: $("chip-baris"),
    cari: $("cari"), urut: $("urut"), judul: $("judul-daftar"), jumlah: $("jumlah"),
    kosong: $("kosong"), reset: $("reset"),
    btnKeranjang: $("btn-keranjang"), badge: $("badge"),
    overlay: $("overlay"), laci: $("laci"), laciJudul: $("laci-judul"),
    laciIsi: $("laci-isi"), laciKaki: $("laci-kaki"), tutup: $("tutup"),
    total: $("total"), inNama: $("in-nama"), inAlamat: $("in-alamat"), galat: $("galat-nama"),
    kirim: $("kirim"), kosongkan: $("kosongkan"),
    umumkan: $("pengumuman"), heroWA: $("hero-wa"), info: $("info-toko"), tahun: $("tahun")
  };

  const produkById = new Map(PRODUK.map((p) => [p.id, p]));
  const kategoriById = new Map(KATEGORI.map((k) => [k.id, k]));

  const state = {
    kategori: "semua",
    cari: "",
    urut: el.urut.value,
    keranjang: muatKeranjang() // { idProduk: jumlah }
  };

  /* ---------- Utilitas ---------- */

  function esc(teks) {
    return String(teks).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function urlWA(teks) {
    return "https://wa.me/" + KONFIG.nomorWA + "?text=" + encodeURIComponent(teks);
  }

  function umumkan(teks) {
    el.umumkan.textContent = teks;
  }

  /* ---------- Keranjang: simpan dan hitung ---------- */

  function muatKeranjang() {
    try {
      const data = JSON.parse(localStorage.getItem(KUNCI) || "{}");
      const hasil = {};
      for (const [id, qty] of Object.entries(data)) {
        const n = Math.min(MAKS, Math.floor(Number(qty)));
        if (produkById.has(Number(id)) && n > 0) hasil[id] = n;
      }
      return hasil;
    } catch (e) {
      return {};
    }
  }

  function simpanKeranjang() {
    try {
      localStorage.setItem(KUNCI, JSON.stringify(state.keranjang));
    } catch (e) {
      /* penyimpanan tidak tersedia, keranjang tetap jalan selama halaman terbuka */
    }
  }

  const qtyDi = (id) => state.keranjang[id] || 0;

  function itemKeranjang() {
    return Object.keys(state.keranjang)
      .map((id) => ({ p: produkById.get(Number(id)), qty: state.keranjang[id] }))
      .filter((i) => i.p);
  }

  function hitung() {
    const items = itemKeranjang();
    return {
      items,
      jumlah: items.reduce((a, i) => a + i.qty, 0),
      total: items.reduce((a, i) => a + i.p.harga * i.qty, 0)
    };
  }

  /* ---------- Info toko ---------- */

  function terapkanKonfig() {
    document.title = KONFIG.nama + " | " + KONFIG.tagline;
    document.querySelectorAll("[data-nama]").forEach((n) => { n.textContent = KONFIG.nama; });
    el.heroWA.href = urlWA("Halo " + KONFIG.nama + ", saya mau tanya soal barang.");
    el.tahun.textContent = new Date().getFullYear();
    el.info.innerHTML =
      '<div><h2>' + esc(KONFIG.nama) + '</h2><p>' + esc(KONFIG.tagline) + '.</p></div>' +
      '<div><h2>Jam buka</h2><p>' + esc(KONFIG.jamBuka) + '</p></div>' +
      '<div><h2>Kontak</h2><p>' + esc(KONFIG.alamat) + '</p>' +
      '<p><a href="' + urlWA("Halo " + KONFIG.nama + ", saya mau tanya.") +
      '" target="_blank" rel="noopener">Chat WhatsApp</a></p></div>';
  }

  /* ---------- Daftar produk ---------- */

  function buatChip() {
    const semua = [{ id: "semua", nama: "Semua" }].concat(KATEGORI);
    el.chip.innerHTML = semua.map((k) =>
      '<button type="button" class="chip" data-kat="' + esc(k.id) + '">' + esc(k.nama) + '</button>'
    ).join("");
    perbaruiChip();
  }

  function perbaruiChip() {
    el.chip.querySelectorAll(".chip").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.kat === state.kategori));
    });
  }

  function daftarTampil() {
    const kata = state.cari.trim().toLowerCase();
    const hasil = PRODUK.filter((p) => {
      if (state.kategori !== "semua" && p.kategori !== state.kategori) return false;
      if (!kata) return true;
      const k = kategoriById.get(p.kategori);
      return (p.nama + " " + p.satuan + " " + (k ? k.nama : "")).toLowerCase().includes(kata);
    });

    const urutan = {
      nama: (a, b) => a.nama.localeCompare(b.nama, "id"),
      murah: (a, b) => a.harga - b.harga || a.nama.localeCompare(b.nama, "id"),
      mahal: (a, b) => b.harga - a.harga || a.nama.localeCompare(b.nama, "id")
    };
    return hasil.sort(urutan[state.urut] || urutan.nama);
  }

  function gambarHTML(p) {
    return p.gambar
      ? '<img src="' + esc(p.gambar) + '" alt="" loading="lazy">'
      : '<span aria-hidden="true">' + esc(p.emoji || "📦") + '</span>';
  }

  function stepperHTML(p, qty) {
    const n = esc(p.nama);
    return '<div class="stepper" role="group" aria-label="Jumlah ' + n + '">' +
      '<button type="button" data-act="dec" data-id="' + p.id + '" aria-label="Kurangi ' + n + '">&minus;</button>' +
      '<span class="stepper-jumlah">' + qty + '</span>' +
      '<button type="button" data-act="inc" data-id="' + p.id + '" aria-label="Tambah ' + n + '">+</button>' +
      '</div>';
  }

  function aksiHTML(p) {
    const qty = qtyDi(p.id);
    if (qty) return stepperHTML(p, qty);
    return '<button type="button" class="btn-tambah" data-act="add" data-id="' + p.id +
      '" aria-label="Tambah ' + esc(p.nama) + ' ke keranjang">Tambah</button>';
  }

  function renderGrid() {
    const daftar = daftarTampil();

    el.grid.innerHTML = daftar.map((p) =>
      '<article class="kartu">' +
        '<div class="tile kat-' + esc(p.kategori) + '">' + gambarHTML(p) + '</div>' +
        '<div class="kartu-isi">' +
          '<h3 class="kartu-nama">' + esc(p.nama) + '</h3>' +
          '<p class="kartu-satuan">' + esc(p.satuan) + '</p>' +
          '<div class="kartu-bawah">' +
            '<div class="harga-blok">' +
              '<span class="harga">' + rupiah.format(p.harga) + '</span>' +
              (p.hargaAsli
                ? '<s class="harga-asli"><span class="sr">Harga sebelumnya </span>' + rupiah.format(p.hargaAsli) + '</s>'
                : '') +
            '</div>' +
            '<div class="aksi" data-id="' + p.id + '">' + aksiHTML(p) + '</div>' +
          '</div>' +
        '</div>' +
      '</article>'
    ).join("");

    el.grid.hidden = daftar.length === 0;
    el.kosong.hidden = daftar.length > 0;

    const k = kategoriById.get(state.kategori);
    el.judul.textContent = k ? k.nama : "Semua barang";
    el.jumlah.textContent = daftar.length + " barang";
  }

  // Ganti tombol Tambah / stepper pada satu kartu saja, supaya fokus keyboard tidak hilang.
  function perbaruiKartu(id, fokusAct) {
    const aksi = el.grid.querySelector('.aksi[data-id="' + id + '"]');
    if (!aksi) return;
    aksi.innerHTML = aksiHTML(produkById.get(id));
    if (fokusAct) {
      const tujuan = fokusAct === "add" ? "inc" : fokusAct;
      const tombol = aksi.querySelector('[data-act="' + tujuan + '"]') || aksi.querySelector("button");
      if (tombol) tombol.focus();
    }
  }

  /* ---------- Ubah isi keranjang ---------- */

  function ubahJumlah(id, aksi, sumber) {
    const p = produkById.get(id);
    if (!p) return;

    const lama = qtyDi(id);
    let baru = lama;
    if (aksi === "add" || aksi === "inc") baru = Math.min(MAKS, lama + 1);
    else if (aksi === "dec") baru = Math.max(0, lama - 1);
    else if (aksi === "hapus") baru = 0;
    if (baru === lama) return;

    if (baru === 0) delete state.keranjang[id];
    else state.keranjang[id] = baru;
    simpanKeranjang();

    perbaruiKartu(id, sumber === "grid" ? aksi : null);
    renderLaci(sumber === "laci" ? { id: id, act: aksi } : null);
    perbaruiBadge(baru > lama);

    umumkan(baru === 0
      ? p.nama + " dihapus dari keranjang"
      : p.nama + ": " + baru + " di keranjang");
  }

  function perbaruiBadge(animasi) {
    const jumlah = hitung().jumlah;
    el.badge.textContent = jumlah;
    el.btnKeranjang.setAttribute("aria-label", "Buka keranjang, " + jumlah + " barang");
    if (animasi) {
      el.badge.classList.remove("loncat");
      void el.badge.offsetWidth; // mulai ulang animasi
      el.badge.classList.add("loncat");
    }
  }

  /* ---------- Laci keranjang ---------- */

  function renderLaci(fokus) {
    const h = hitung();
    const kosong = h.items.length === 0;
    el.laciKaki.hidden = kosong;
    el.total.textContent = rupiah.format(h.total);

    if (kosong) {
      el.laciIsi.innerHTML =
        '<div class="laci-kosong">' +
          '<p class="laci-kosong-judul">Keranjang masih kosong</p>' +
          '<p>Pilih barang dari daftar, lalu kembali ke sini untuk memesan.</p>' +
          '<button type="button" class="btn btn-navy" data-act="lihat">Lihat barang</button>' +
        '</div>';
    } else {
      el.laciIsi.innerHTML = h.items.map(({ p, qty }) =>
        '<div class="item" data-id="' + p.id + '">' +
          '<div class="item-tile kat-' + esc(p.kategori) + '">' + gambarHTML(p) + '</div>' +
          '<div>' +
            '<p class="item-nama">' + esc(p.nama) + '</p>' +
            '<p class="item-info">' + rupiah.format(p.harga) + ' (' + esc(p.satuan) + ')</p>' +
            '<div class="item-baris">' +
              stepperHTML(p, qty) +
              '<span class="item-sub">' + rupiah.format(p.harga * qty) + '</span>' +
            '</div>' +
            '<button type="button" class="btn-hapus" data-act="hapus" data-id="' + p.id +
              '" aria-label="Hapus ' + esc(p.nama) + ' dari keranjang">Hapus</button>' +
          '</div>' +
        '</div>'
      ).join("");
    }

    if (fokus) {
      const tombol =
        el.laciIsi.querySelector('.item[data-id="' + fokus.id + '"] [data-act="' + fokus.act + '"]') ||
        el.laciIsi.querySelector("[data-act]");
      (tombol || el.laciJudul).focus();
    }
  }

  let pemicu = null;

  function bukaLaci() {
    pemicu = document.activeElement;
    el.laci.classList.add("buka");
    el.overlay.classList.add("buka");
    document.body.classList.add("terkunci");
    el.btnKeranjang.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => el.laciJudul.focus());
  }

  function tutupLaci() {
    if (!el.laci.classList.contains("buka")) return;
    el.laci.classList.remove("buka");
    el.overlay.classList.remove("buka");
    document.body.classList.remove("terkunci");
    el.btnKeranjang.setAttribute("aria-expanded", "false");
    (pemicu && document.contains(pemicu) ? pemicu : el.btnKeranjang).focus();
  }

  /* ---------- Kirim pesanan lewat WhatsApp ---------- */

  function kirimPesanan() {
    const h = hitung();
    if (!h.items.length) return;

    const nama = el.inNama.value.trim();
    if (!nama) {
      el.galat.hidden = false;
      el.inNama.setAttribute("aria-invalid", "true");
      el.inNama.focus();
      return;
    }

    const baris = h.items.map(({ p, qty }, i) =>
      (i + 1) + ". " + p.nama + " x " + qty + " = " + rupiah.format(p.harga * qty)
    );
    const teks = [
      "Halo " + KONFIG.nama + ", saya mau pesan:",
      ""
    ].concat(baris, [
      "",
      "Total: " + rupiah.format(h.total),
      "",
      "Nama: " + nama
    ]);
    const alamat = el.inAlamat.value.trim();
    if (alamat) teks.push("Alamat/catatan: " + alamat);

    window.open(urlWA(teks.join("\n")), "_blank", "noopener");
  }

  /* ---------- Event ---------- */

  el.chip.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    state.kategori = b.dataset.kat;
    perbaruiChip();
    renderGrid();
  });

  el.cari.addEventListener("input", () => {
    state.cari = el.cari.value;
    renderGrid();
    // Kalau masih di bagian atas halaman, gulir ke daftar barang.
    if (state.cari && window.scrollY < el.etalase.offsetTop - 200) {
      el.etalase.scrollIntoView();
    }
  });

  el.urut.addEventListener("change", () => {
    state.urut = el.urut.value;
    renderGrid();
  });

  el.reset.addEventListener("click", () => {
    state.kategori = "semua";
    state.cari = "";
    el.cari.value = "";
    perbaruiChip();
    renderGrid();
  });

  el.grid.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (b) ubahJumlah(Number(b.dataset.id), b.dataset.act, "grid");
  });

  el.laciIsi.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    if (b.dataset.act === "lihat") {
      tutupLaci();
      el.etalase.scrollIntoView();
      return;
    }
    ubahJumlah(Number(b.dataset.id), b.dataset.act, "laci");
  });

  el.btnKeranjang.addEventListener("click", bukaLaci);
  el.tutup.addEventListener("click", tutupLaci);
  el.overlay.addEventListener("click", tutupLaci);
  el.kirim.addEventListener("click", kirimPesanan);

  el.inNama.addEventListener("input", () => {
    el.galat.hidden = true;
    el.inNama.removeAttribute("aria-invalid");
  });

  el.kosongkan.addEventListener("click", () => {
    if (!confirm("Kosongkan semua barang di keranjang?")) return;
    state.keranjang = {};
    simpanKeranjang();
    renderGrid();
    renderLaci({});
    perbaruiBadge(false);
    umumkan("Keranjang dikosongkan");
  });

  // Esc menutup keranjang; Tab tetap berputar di dalam keranjang selagi terbuka.
  document.addEventListener("keydown", (e) => {
    if (!el.laci.classList.contains("buka")) return;

    if (e.key === "Escape") {
      tutupLaci();
      return;
    }
    if (e.key !== "Tab") return;

    const bisaFokus = Array.from(
      el.laci.querySelectorAll("button, input, textarea, a[href]")
    ).filter((n) => !n.disabled && n.offsetParent !== null);
    if (!bisaFokus.length) return;

    const awal = bisaFokus[0];
    const akhir = bisaFokus[bisaFokus.length - 1];
    const aktif = document.activeElement;

    if (e.shiftKey && (aktif === awal || aktif === el.laciJudul)) {
      e.preventDefault();
      akhir.focus();
    } else if (!e.shiftKey && aktif === akhir) {
      e.preventDefault();
      awal.focus();
    }
  });

  /* ---------- Mulai ---------- */

  terapkanKonfig();
  buatChip();
  renderGrid();
  renderLaci(null);
  perbaruiBadge(false);
})();
