Nama : Ahmad Riko Dyansyah
NBI : 1462400002
Matakuliah : Grafika Komputer

Repository ini berisi kumpulan game interaktif berbasis **p5.js** yang dibuat sebagai latihan, eksplorasi kreativitas, dan pengembangan skill dalam bidang **Game Development & Web Programming**.

1. Neon Dodge

Game reflex sederhana dimana player harus menghindari musuh yang datang dari atas.

**Fitur:**

* Sistem skor & level
* High score tersimpan (localStorage)
* Particle explosion effect
* Sound effect (oscillator)

2. Modern Tetris

Game Tetris klasik dengan tampilan modern dan efek glow.

**Fitur:**

* 3 tingkat kesulitan (Easy, Medium, Hard)
* Sistem level & skor
* High score tersimpan
* Rotasi blok
* UI neon modern


3. Fruit Catcher

Game menangkap buah dengan sistem combo dan power gameplay.

**Fitur:**

* Combo system (x2, x3, dst)
* 3 difficulty level
* Sound effect & background music
* Sprite gambar (buah & bom)
* Animasi UI & efek visual


4. Cyber Road (Endless Driving PRO)

Game endless driving dengan konsep cyberpunk dan visual modern.

**Fitur:**

* Sistem level otomatis (Easy → Medium → Hard)
* Score bertambah saat menghindari rintangan
* Near miss system (bonus + slow motion)
* Power-up (coin, shield, boost)
* Animasi smooth (lerp movement)
* Visual cyberpunk (neon, bintang, glow)

Teknologi yang Digunakan

* JavaScript
* p5.js
* p5.sound (untuk audio)
* HTML5 Canvas

Cara Menjalankan Project

Cara 1 (Paling Mudah – Online)

1. Buka: https://editor.p5js.org/
2. Copy salah satu file (`Pertemuan 1.js`, dll)
3. Paste ke editor
4. Klik tombol ▶️ Run

Cara 2 (Offline / Local)

1. Download atau clone repository ini
2. Buat file `index.html`
3. Tambahkan kode berikut:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/addons/p5.sound.min.js"></script>
</head>
<body>
  <script src="Pertemuan 1.js"></script>
</body>
</html>
```

4. Jalankan file HTML di browser

💡 Ganti nama file JS sesuai game yang ingin dijalankan.

---

## 🎮 Kontrol Game

### Neon Dodge

* ⬅️ ➡️ / A D → Gerak
* SPACE / Klik → Start / Restart

### Tetris

* ⬅️ ➡️ → Gerak
* ⬇️ → Turun cepat
* SPACE → Rotate

### Fruit Catcher

* ⬅️ ➡️ → Gerak
* Mouse → Pilih difficulty

### Cyber Road

* ⬅️ ➡️ → Pindah jalur
* ENTER → Start
* R → Restart

---

## 📈 Tujuan Project

Project ini dibuat untuk:

* Melatih logika pemrograman
* Mengembangkan skill JavaScript & p5.js
* Eksplorasi desain game modern
* Membangun portfolio sebagai mahasiswa Teknik Informatika

---

## 💡 Pengembangan Selanjutnya

Beberapa fitur yang bisa ditambahkan:

* 🎵 Background music custom
* 🚗 Sprite HD & animasi realistis
* 📱 Support mobile (touch control)
* 🌐 Deploy ke web (itch.io / GitHub Pages)

---

## 👨‍💻 Author

**Ahmad Riko Dyansyah**
Mahasiswa Teknik Informatika
Game Developer Enthusiast 🎮

---

## ⭐ Penutup

Jika kamu suka project ini, jangan lupa:

* ⭐ Star repository
* 🍴 Fork project
* 💬 Berikan feedback

Terima kasih 🙌
