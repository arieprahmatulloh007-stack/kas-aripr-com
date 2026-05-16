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

 simpanKas(){

   let masuk =
   Number(
   document.getElementById('nominalMasuk').value || 0
   );

   let keluar =
   Number(
   document.getElementById('nominalKeluar').value || 0
   );

   if(masuk <=0 && keluar <=0){

      alert('Isi nominal');

      return;
   }

   let data = {

      action : 'tambahKas',

      tanggal :
      document.getElementById('tglKas').value,

      masuk : masuk,

      keluar : keluar,

      sumberMasuk :
      document.getElementById('sumberMasuk').value,

      sumberKeluar :
      document.getElementById('sumberKeluar').value,

      keterangan :
      document.getElementById('ketKas').value
   };

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify(data)
   });

   alert('Data kas berhasil disimpan');

   document.getElementById('tglKas').value='';
   document.getElementById('nominalMasuk').value='';
   document.getElementById('nominalKeluar').value='';
   document.getElementById('sumberMasuk').value='';
   document.getElementById('sumberKeluar').value='';
   document.getElementById('ketKas').value='';

   loadKas();
   loadDashboard();
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
   simpankas
========================= */

async function simpanKas(){

   let masuk =
   Number(
   document.getElementById('nominalMasuk').value || 0
   );

   let keluar =
   Number(
   document.getElementById('nominalKeluar').value || 0
   );

   if(masuk <=0 && keluar <=0){

      alert('Isi nominal');

      return;
   }

   let data = {

      action : 'tambahKas',

      tanggal :
      document.getElementById('tglKas').value,

      masuk : masuk,

      keluar : keluar,

      keterangan :
      document.getElementById('ketKas').value
   };

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify(data)
   });

   alert('Data kas berhasil disimpan');

   document.getElementById('tglKas').value='';
   document.getElementById('nominalMasuk').value='';
   document.getElementById('nominalKeluar').value='';
   document.getElementById('ketKas').value='';

   loadKas();
   loadDashboard();
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

         <td>

            <button
            onclick="hapusCicilan('${item.rowid}')"
            style="
               background:red;
               color:white;
               border:none;
               padding:8px 12px;
               border-radius:8px;
               cursor:pointer;
            ">
               Hapus
            </button>

         </td>

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

      let sisa =
      parseInt(item.sisa);

      /* HANYA YANG MASIH ADA SISA */

      if(sisa > 0){

         html += `
         <option value="${item.id}">

            ${item.nama}
            - Sisa:
            ${rupiah(sisa)}

         </option>
         `;
      }
   });

   document.getElementById('idPeminjam')
   .innerHTML = html;
}
/* =========================
   HAPUS CICILAN
========================= */

async function hapusCicilan(id){

   let konfirmasi =
   confirm('Yakin ingin menghapus data?');

   if(!konfirmasi){
      return;
   }

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'hapusCicilan',

         id:id

      })
   });

   alert('Data berhasil dihapus');

   loadCicilan();
   loadDashboard();
}
/* =========================
   loadKas
========================= */

async function loadKas(){

   const res =
   await fetch(API_URL + '?action=getKas');

   const data = await res.json();

   let html = '';

   data.forEach(item=>{

      html += `
      <tr>

         <td>${item.tanggal}</td>

         <td>${rupiah(item.masuk)}</td>

         <td>${rupiah(item.keluar)}</td>

         <td>${item.sumberMasuk}</td>

         <td>${item.sumberKeluar}</td>

         <td>${item.keterangan}</td>

      </tr>
      `;
   });

   document.getElementById('tableKas')
   .innerHTML = html;
}
/* =========================
   AUTO LOAD
========================= */

loadDashboard();
loadKas();
loadPinjaman();
loadCicilan();
loadKas();
loadDropdownPeminjam();
