"use strict";

const rp = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
const JP_CAP = 10547400;      // batas upah Jaminan Pensiun 2025
const KES_CAP = 12000000;     // batas upah BPJS Kesehatan
const BIAYA_JABATAN_CAP = 6000000;

const BRACKETS = [
  [60000000, 0.05], [250000000, 0.15], [500000000, 0.25], [5000000000, 0.30], [Infinity, 0.35],
];
function taxOnPKP(pkp) {
  let tax = 0, prev = 0;
  for (const [limit, rate] of BRACKETS) {
    if (pkp <= prev) break;
    tax += (Math.min(pkp, limit) - prev) * rate;
    prev = limit;
  }
  return tax;
}
function annualTax(annualGross, annualContrib, ptkp) {
  const biayaJabatan = Math.min(0.05 * annualGross, BIAYA_JABATAN_CAP);
  const neto = annualGross - biayaJabatan - annualContrib;
  const pkp = Math.max(0, Math.floor((neto - ptkp) / 1000) * 1000);
  return { tax: taxOnPKP(pkp), biayaJabatan, neto, pkp };
}

function calc() {
  const pokok = Number(document.getElementById("input-pokok").value) || 0;
  const tunj = Number(document.getElementById("input-tunjangan").value) || 0;
  const ptkp = Number(document.getElementById("input-ptkp").value);
  const thr = Number(document.getElementById("input-thr").value) || 0;
  const useKes = document.getElementById("input-bpjs-kes").checked;
  const useTk = document.getElementById("input-bpjs-tk").checked;

  const gross = pokok + tunj;
  const kes = useKes ? 0.01 * Math.min(gross, KES_CAP) : 0;
  const jht = useTk ? 0.02 * gross : 0;
  const jp = useTk ? 0.01 * Math.min(gross, JP_CAP) : 0;
  const contrib = kes + jht + jp;

  const annual = annualTax(gross * 12, contrib * 12, ptkp);
  const taxMonthly = annual.tax / 12;
  const thp = gross - contrib - taxMonthly;

  document.getElementById("r-thp").textContent = rp(thp);
  document.getElementById("r-verdict").textContent =
    `Dari gaji kotor ${rp(gross)}, potongan BPJS ${rp(contrib)} dan PPh 21 sekitar ${rp(taxMonthly)} per bulan.`;

  document.getElementById("r-facts").innerHTML = [
    ["BPJS Kesehatan", rp(kes) + "/bln"],
    ["JHT + JP", rp(jht + jp) + "/bln"],
    ["PPh 21", rp(taxMonthly) + "/bln"],
    ["PKP setahun", rp(annual.pkp)],
  ].map(([k, v]) => `<div class="fact-chip"><span>${k}</span><strong>${v}</strong></div>`).join("");

  const rows = [
    ["Gaji kotor setahun", rp(gross * 12)],
    ["Biaya jabatan (5%, maks 6 jt)", "− " + rp(annual.biayaJabatan)],
    ["Iuran BPJS setahun", "− " + rp(contrib * 12)],
    ["Penghasilan neto", rp(annual.neto)],
    ["PTKP", "− " + rp(ptkp)],
    ["PKP (dibulatkan ke ribuan)", rp(annual.pkp)],
  ];
  document.getElementById("r-table").innerHTML =
    rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("") +
    `<tr class="total"><td>PPh 21 setahun</td><td>${rp(annual.tax)}</td></tr>`;

  const thrNote = document.getElementById("r-thr-note");
  if (thr > 0) {
    const withThr = annualTax(gross * 12 + thr, contrib * 12, ptkp);
    const thrTax = Math.max(0, withThr.tax - annual.tax);
    thrNote.hidden = false;
    thrNote.textContent = `THR ${rp(thr)} kena pajak sekitar ${rp(thrTax)} — yang masuk rekening sekitar ${rp(thr - thrTax)}. (THR tidak dipotong BPJS.)`;
  } else {
    thrNote.hidden = true;
  }
}

for (const id of ["input-pokok", "input-tunjangan", "input-ptkp", "input-thr", "input-bpjs-kes", "input-bpjs-tk"]) {
  document.getElementById(id).addEventListener("input", calc);
  document.getElementById(id).addEventListener("change", calc);
}
calc();
