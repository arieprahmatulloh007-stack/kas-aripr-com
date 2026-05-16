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

      tanggal :
      document.getElementById('tglMasuk').value,

      nominal :
      document.getElementById('nominalMasuk').value,

      keterangan :
      document.getElementById('ketMasuk').value
   };

   await fetch(API_URL,{
      method:'POST',
      body:JSON.stringify(data)
   });

   alert('Kas masuk berhasil disimpan');

   document.getElementById('tglMasuk').value='';
   document.getElementById('nominalMasuk').value='';
   document.getElementById('ketMasuk').value='';

   loadDashboard();
   loadKasMasuk();
}

/* =========================
   KAS KELUAR
========================= */

async function simpanKasKeluar(){

   let data = {

      action : 'tambahKasKeluar',

      tanggal :
      document.getElementById('tglKeluar').value,

      nominal :
      document.getElementById('nominalKeluar').value,

      keterangan :
      document.getElementById('ketKeluar').value
   };

   await fetch(API_URL,{
      method:'POST',
      body:JSON.stringify(data)
   });

   alert('Kas keluar berhasil disimpan');

   document.getElementById('tglKeluar').value='';
   document.getElementById('nominalKeluar').value='';
   document.getElementById('ketKeluar').value='';

   loadDashboard();
   loadKasKeluar();
}

/* =========================
   PINJAMAN
========================= */

async function simpanPinjaman(){

   let total =
   Number(document.getElementById('totalPinjam').value);

   let lama =
   Number(document.getElementById('lamaCicilan').value);

   let cicilan = total / lama;

   let data = {

      action : 'tambahPinjaman',

      nama :
      document.getElementById('namaPinjam').value,

      hp :
      document.getElementById('hpPinjam').value,

      alamat :
      document.getElementById('alamatPinjam').value,

      total : total,

      cicilan : cicilan
   };

   await fetch(API_URL,{
      method:'POST',
      body:JSON.stringify(data)
   });

   alert('Pinjaman berhasil disimpan');

   document.getElementById('namaPinjam').value='';
   document.getElementById('hpPinjam').value='';
   document.getElementById('alamatPinjam').value='';
   document.getElementById('totalPinjam').value='';
   document.getElementById('lamaCicilan').value='';

   loadPinjaman();
   loadDropdownPeminjam();
   loadDashboard();
}

/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard(){

   const res =
   await fetch(API_URL + '?action=dashboard');

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
   CHART
========================= */

let chart;

function loadChart(masuk, keluar){

   const ctx =
   document.getElementById('myChart');

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

   const res =
   await fetch(API_URL + '?action=getKasMasuk');

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

   document.getElementById('tableKasMasuk')
   .innerHTML = html;
}

/* =========================
   LOAD KAS KELUAR
========================= */

async function loadKasKeluar(){

   const res =
   await fetch(API_URL + '?action=getKasKeluar');

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

   document.getElementById('tableKasKeluar')
   .innerHTML = html;
}

/* =========================
   LOAD PINJAMAN
========================= */

async function loadPinjaman(){

   const res =
   await fetch(API_URL + '?action=getPinjaman');

   const data = await res.json();

   let html = '';

   data.forEach(item=>{

      html += `
      <tr>

         <td>${item.nama}</td>

         <td>${rupiah(item.total)}</td>

         <td>${rupiah(item.sudah)}</td>

         <td>${rupiah(item.sisa)}</td>

         <td style="
            color:
            ${item.status == 'LUNAS'
            ? 'green'
            : 'red'}
         ">
            ${item.status}
         </td>

      </tr>
      `;
   });

   document.getElementById('tablePinjaman')
   .innerHTML = html;
}

/* =========================
   BAYAR CICILAN
========================= */

async function bayarCicilan(){

   let data = {

      action : 'bayarCicilan',

      id :
      document.getElementById('idPeminjam').value,

      cicilan :
      document.getElementById('cicilanKe').value,

      bayar :
      document.getElementById('bayarNominal').value
   };

   await fetch(API_URL,{
      method:'POST',
      body:JSON.stringify(data)
   });

   alert('Pembayaran berhasil');

   document.getElementById('cicilanKe').value='';
   document.getElementById('bayarNominal').value='';

   loadDashboard();
   loadPinjaman();
   loadCicilan();
   loadDropdownPeminjam();
}

/* =========================
   LOAD CICILAN
========================= */

async function loadCicilan(){

   const res =
   await fetch(API_URL + '?action=getCicilan');

   const data = await res.json();

   let html = '';

   data.forEach(item=>{

      html += `
      <tr>

         <td>${item.tanggal}</td>

         <td>${item.id}</td>

         <td>Cicilan Ke-${item.cicilan}</td>

         <td>${rupiah(item.bayar)}</td>

         <td>${rupiah(item.sisa)}</td>

      </tr>
      `;
   });

   document.getElementById('tableCicilan')
   .innerHTML = html;
}

/* =========================
   DROPDOWN PEMINJAM
========================= */

async function loadDropdownPeminjam(){

   const res =
   await fetch(API_URL + '?action=getPinjaman');

   const data = await res.json();

   let html =
   '<option value=\"\">Pilih Peminjam</option>';

   data.forEach(item=>{

      html += `
      <option value="${item.id}">

         ${item.nama}
         - Sisa:
         ${rupiah(item.sisa)}

      </option>
      `;
   });

   document.getElementById('idPeminjam')
   .innerHTML = html;
}

/* =========================
   AUTO LOAD
========================= */

loadDashboard();
loadKasMasuk();
loadKasKeluar();
loadPinjaman();
loadCicilan();
loadDropdownPeminjam();
