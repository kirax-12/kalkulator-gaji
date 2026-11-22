# Kalkulator Gaji Bersih

Web app statis buat menghitung take home pay karyawan Indonesia dari gaji pokok: potongan BPJS Kesehatan, BPJS Ketenagakerjaan (JHT + JP), dan PPh 21 berdasarkan status PTKP — lengkap dengan rincian tahunan (biaya jabatan, neto, PKP, pajak setahun) dan perhitungan pajak THR.

Dibuat oleh **Remike Dev**.

## Fitur

- **Take home pay per bulan** — angka utama besar, langsung berubah setiap input diganti.
- **Rincian potongan** — BPJS Kesehatan 1% (batas upah 12 jt), JHT 2%, JP 1% (batas upah JP 2025: Rp10.547.400); keduanya bisa dimatikan lewat centang.
- **PPh 21 transparan** — metode tahunan tarif Pasal 17: bruto setahun − biaya jabatan (5%, maks 6 jt) − iuran BPJS − PTKP → PKP (dibulatkan ke ribuan) → tarif progresif 5/15/25/30/35%.
- **8 status PTKP** — TK/0 sampai K/3 sesuai nilai resminya (54 jt – 72 jt).
- **Pajak THR** — isi THR, keluar pajaknya dan bersihnya (selisih pajak tahunan dengan dan tanpa THR; THR tidak dipotong BPJS).

## Catatan

Ini estimasi dengan metode tahunan, bukan metode TER bulanan — total pajak setahunnya setara, rincian per bulan bisa sedikit berbeda dari slip gaji. Bukan pengganti konsultasi pajak.

## Teknologi

HTML · CSS · JavaScript murni, tanpa framework dan tanpa build step.

## Lisensi

MIT
