const API_URL =
'https://script.google.com/macros/s/AKfycbx0nv2PTvEZMoR5bQUl8WV5ckTI56RrZmvPo-v_NGiHjiX-IkgCyBkmLwcyT5Vu6gRg/exec';

/* =========================
   MENU
========================= */

function showPage(id){

  const pages = document.querySelectorAll('.page');

  pages.forEach(p=>{
    p.style.display='none';
  });

  document.getElementById(id).style.display='block';
}

showPage('dashboard');

/* =========================
   LOGOUT
========================= */

function logout(){

   localStorage.clear();

   window.location='login.html';
}

/* =========================
   FORMAT RUPIAH
========================= */

function rupiah(angka){
   return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

/* =========================
   KAS MASUK
========================= */

async function simpanKasMasuk(){

   let data = {
      action : 'tambahKasMasuk',
      tanggal : document.getElementById('tglMasuk').value,
      nominal : document.getElementById('nominalMasuk').value,
      keterangan : document.getElementById('ketMasuk').value
   };

   await fetch(API_URL,{
      method:'POST',
      body:JSON.stringify(data)
   });

   alert('Kas masuk berhasil disimpan');

   loadDashboard();
   loadKasMasuk();
}

/* =========================
   KAS KELUAR
========================= */

async function simpanKasKeluar(){

   let data = {
      action : 'tambahKasKeluar',
      tanggal : document.getElementById('tglKeluar').value,
      nominal : document.getElementById('nominalKeluar').value,
      keterangan : document.getElementById('ketKeluar').value
   };

   await fetch(API_URL,{
      method:'POST',
      body:JSON.stringify(data)
   });

   alert('Kas keluar berhasil disimpan');

   loadDashboard();
   loadKasKeluar();
}

/* =========================
   PINJAMAN
========================= */

async function simpanPinjaman(){

   let data = {
      action : 'tambahPinjaman',
      nama : document.getElementById('namaPinjam').value,
      total : document.getElementById('totalPinjam').value
   };

   await fetch(API_URL,{
      method:'POST',
      body:JSON.stringify(data)
   });

   alert('Pinjaman berhasil disimpan');

   loadDashboard();
   loadPinjaman();
}

/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard(){

   const res = await fetch(API_URL + '?action=dashboard');

   const data = await res.json();

   document.getElementById('totalMasuk').innerHTML =
   rupiah(data.totalMasuk);

   document.getElementById('totalKeluar').innerHTML =
   rupiah(data.totalKeluar);

   document.getElementById('sisaPiutang').innerHTML =
   rupiah(data.totalPiutang);

   loadChart(
      data.totalMasuk,
      data.totalKeluar
   );
}

/* =========================
   LOAD CHART
========================= */

let chart;

function loadChart(masuk, keluar){

   const ctx = document.getElementById('myChart');

   if(chart){
      chart.destroy();
   }

   chart = new Chart(ctx, {

      type: 'bar',

      data: {

         labels: [
            'Kas Masuk',
            'Kas Keluar'
         ],

         datasets: [{

            label: 'Statistik Keuangan',

            data: [masuk, keluar],

            borderWidth:1

         }]
      }
   });
}

/* =========================
   LOAD KAS MASUK
========================= */

async function loadKasMasuk(){

   const res = await fetch(API_URL + '?action=getKasMasuk');

   const data = await res.json();

   let html = '';

   data.forEach(item=>{

      html += `
      <tr>
         <td>${item.tanggal}</td>
         <td>${rupiah(item.nominal)}</td>
         <td>${item.keterangan}</td>
      </tr>
      `;
   });

   document.getElementById('tableKasMasuk').innerHTML = html;
}

/* =========================
   LOAD KAS KELUAR
========================= */

async function loadKasKeluar(){

   const res = await fetch(API_URL + '?action=getKasKeluar');

   const data = await res.json();

   let html = '';

   data.forEach(item=>{

      html += `
      <tr>
         <td>${item.tanggal}</td>
         <td>${rupiah(item.nominal)}</td>
         <td>${item.keterangan}</td>
      </tr>
      `;
   });

   document.getElementById('tableKasKeluar').innerHTML = html;
}

/* =========================
   LOAD PINJAMAN
========================= */

async function loadPinjaman(){

   const res = await fetch(API_URL + '?action=getPinjaman');

   const data = await res.json();

   let html = '';

   data.forEach(item=>{

      html += `
      <tr>
         <td>${item.nama}</td>
         <td>${rupiah(item.total)}</td>
         <td style="color:red;">
            BELUM LUNAS
         </td>
      </tr>
      `;
   });

   document.getElementById('tablePinjaman').innerHTML = html;
}

/* =========================
   AUTO LOAD
========================= */

loadDashboard();
loadKasMasuk();
loadKasKeluar();
loadPinjaman();
