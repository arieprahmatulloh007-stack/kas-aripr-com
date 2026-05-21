const API_URL =
'https://script.google.com/macros/s/AKfycbx0nv2PTvEZMoR5bQUl8WV5ckTI56RrZmvPo-v_NGiHjiX-IkgCyBkmLwcyT5Vu6gRg/exec';
/* =========================
   GLOBAL DATA
========================= */

let kasData = [];

let pinjamanData = [];

let cicilanData = [];
let uploadBtn = null;
/* PAGE */

function showPage(id){

   document
   .querySelectorAll('.page')
   .forEach(page=>{

      page.style.display='none';
   });

   let target =
   document.getElementById(id);

   if(target){

      target.style.display='block';
   }
}

/* DEFAULT PAGE */

window.onload = function(){

   showPage('dashboard');

   loadDashboard();
   
   loadDashboardPayroll();

   loadKas();

   loadPinjaman();

   loadCicilan();

   loadDropdownPeminjam();

   loadPayroll();

   loadTeknisi();

   loadSlipNama();

};

/* LOGOUT */

function logout(){

   localStorage.clear();

   window.location='login.html';
}

/* FORMAT */

function formatRupiah(angka){

   return Number(angka || 0)
   .toLocaleString('id-ID');
}

function rupiah(angka){

   return 'Rp ' +
   Number(angka || 0)
   .toLocaleString('id-ID');
}

function formatTanggal(tanggal){

   return new Date(tanggal)
   .toLocaleDateString('id-ID');
}

/* DASHBOARD */

async function loadDashboard(){

   const res =
   await fetch(API_URL + '?action=dashboard');

   const data =
   await res.json();
   document.getElementById('totalMasuk')
   .innerHTML =
   rupiah(data.totalMasuk);

   document.getElementById('totalKeluar')
   .innerHTML =
   rupiah(data.totalKeluar);

   document.getElementById('sisaKas')
   .innerHTML =
   rupiah(data.sisaKas);

   document.getElementById('totalPinjaman')
   .innerHTML =
   rupiah(data.totalPinjaman);

   document.getElementById('sisaPiutang')
   .innerHTML =
   rupiah(data.totalPiutang);

   /* =========================
      BELUM LUNAS
   ========================= */

   let html='';

   data.belumLunas.forEach(item=>{

      html += `
      <p>

         ${item.nama}
         -
         ${rupiah(item.sisa)}

      </p>
      `;
   });

   document.getElementById('belumLunasList')
   .innerHTML = html;
}

async function loadDashboardPayroll(){

   let res =
   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'getPayroll'
      })
   });

   let data =
   await res.json();

   if(!Array.isArray(data)){

      console.log(data);

      return;
   }

   let periodeGaji = {};

   let periodeSC = {};

   let teknisi = {};

   data.forEach(item=>{

      let periode =
      item.periode || '-';

      if(!periodeGaji[periode]){

         periodeGaji[periode] = 0;
      }

      periodeGaji[periode] +=
      Number(item.totalGaji || 0);

      if(!periodeSC[periode]){

         periodeSC[periode] = 0;
      }

      periodeSC[periode] +=
      Number(item.jumlahOrder || 0);

      if(!teknisi[item.nama]){

         teknisi[item.nama] = {

            gaji:0,

            sc:0,

            status:item.status
         };
      }

      teknisi[item.nama].gaji +=
      Number(item.totalGaji || 0);

      teknisi[item.nama].sc +=
      Number(item.jumlahOrder || 0);
   });

   let htmlGaji = '';

   Object.keys(periodeGaji)
   .reverse()
   .forEach(p=>{

      htmlGaji += `

      <div class="row-dashboard">

         <span>${p}</span>

         <b>${rupiah(periodeGaji[p])}</b>

      </div>
      `;
   });

   document.getElementById(
   'dashboardPeriodeGaji'
   ).innerHTML = htmlGaji;

   let htmlSC = '';

   Object.keys(periodeSC)
   .reverse()
   .forEach(p=>{

      htmlSC += `

      <div class="row-dashboard">

         <span>${p}</span>

         <b>${periodeSC[p]} SC</b>

      </div>
      `;
   });

   document.getElementById(
   'dashboardPeriodeSC'
   ).innerHTML = htmlSC;

   let htmlTeknisi = '';

   Object.keys(teknisi)
   .forEach(nama=>{

     htmlTeknisi += `

	<div class="rank-card">

   <div class="rank-left">

      <b>${nama}</b><br>

      ${teknisi[nama].sc} SC

   </div>

   <div class="rank-right">

      <b>
      ${rupiah(teknisi[nama].gaji)}
      </b><br>

      <span class="${
      teknisi[nama].status ==
      'SUDAH TRANSFER'
      ?
      'status-transfer'
      :
      'status-belum'
      }">

      ${teknisi[nama].status}

      </span>

   </div>

	</div>
	`;
   });

   document.getElementById(
   'dashboardTeknisiPayroll'
   ).innerHTML = htmlTeknisi;
new Chart(

document.getElementById(
'chartGaji'
),{

   type:'bar',

   data:{

      labels:Object.keys(periodeGaji),

      datasets:[{

         label:'Total Gaji',

         data:Object.values(periodeGaji),

         borderWidth:1
      }]
   }
});

new Chart(

document.getElementById(
'chartSC'
),{

   type:'line',

   data:{

      labels:Object.keys(periodeSC),

      datasets:[{

         label:'Total SC',

         data:Object.values(periodeSC),

         borderWidth:2
      }]
   }
});
}
/* SIMPAN KAS */

async function simpanKas(){

   let data = {

      action:'tambahKas',

      editId:
      localStorage.getItem('editKas'),
      
      tanggal:
      document.getElementById('tglKas').value,

      masuk:
      document.getElementById('nominalMasuk').value,

      keluar:
      document.getElementById('nominalKeluar').value,

      sumberMasuk:
      document.getElementById('sumberMasuk').value,

      sumberKeluar:
      document.getElementById('sumberKeluar').value,

      keterangan:
      document.getElementById('ketKas').value


   };

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify(data)
   });

   alert('Berhasil');

   document.getElementById('tglKas').value='';

   document.getElementById('nominalMasuk').value='';

   document.getElementById('nominalKeluar').value='';

   document.getElementById('sumberMasuk').value='';

   document.getElementById('sumberKeluar').value='';

   document.getElementById('ketKas').value='';
   localStorage.removeItem('editKas');
   loadKas();

   loadDashboard();
}

/* LOAD KAS */

async function loadKas(){

   try{

      const res =
      await fetch(API_URL + '?action=getKas');

      const data =
      await res.json();

      kasData = data;

      let html='';

      data.forEach(item=>{

         html += `
         <tr>

            <td>${item.tanggal}</td>

            <td>${rupiah(item.masuk)}</td>

            <td>${rupiah(item.keluar)}</td>

            <td>${item.sumberMasuk}</td>

            <td>${item.sumberKeluar}</td>

            <td>${item.keterangan}</td>

            <td>

               <button
               onclick="editKas('${item.row}')">

               Edit

               </button>

               <button
               onclick="hapusKas('${item.row}')">

               Hapus

               </button>

            </td>

         </tr>
         `;
      });

      document.getElementById('tableKas')
      .innerHTML = html;

   }catch(err){

      console.log(err);
   }
}
/* LOAD PINJAMAN */

async function loadPinjaman(){

   const res =
   await fetch(API_URL + '?action=getPinjaman');

   const data =
   await res.json();
   pinjamanData = data;
   let html='';

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
         ? '#16a34a'
         : '#dc2626'};
         font-weight:bold;
               ">
         ${item.status}
         </td>
         
         <td>
         <button
         onclick="editPinjaman('${item.row}')">
         Edit
         </button>
         <button
         onclick="hapusPinjaman('${item.row}')">
         Hapus
         </button>
         </td>
         
      </tr>
      `;
   });

   document.getElementById('tablePinjaman')
   .innerHTML = html;
}

/* CICILAN */

async function bayarCicilan(){

   let data = {

      action:'bayarCicilan',
      editId:
      localStorage.getItem('editCicilan'),
      
      id:
      document.getElementById('idPeminjam').value,

      cicilan:
      document.getElementById('cicilanKe').value,

      bayar:
      document.getElementById('bayarNominal').value
   };

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify(data)
   });

   alert('Pembayaran berhasil');
   document.getElementById('cicilanKe').value='';

   document.getElementById('bayarNominal').value='';
   localStorage.removeItem('editCicilan');
   loadCicilan();

   loadPinjaman();

   loadDashboard();
}

/* LOAD CICILAN */

async function loadCicilan(){

   const res =
   await fetch(API_URL + '?action=getCicilan');

   const data =
   await res.json();
   cicilanData = data;
   let html='';

   data.forEach(item=>{

      html += `
      <tr>

         <td>${item.tanggal}</td>

         <td>${item.id}</td>

         <td>${item.cicilan}</td>

         <td>${rupiah(item.bayar)}</td>

         <td>${rupiah(item.sisa)}</td>

         <td>
         <button
         onclick="editCicilan('${item.rowid}')">
         Edit
         </button>
         <button
         onclick="hapusCicilan('${item.rowid}')">
         Hapus
         </button>
         </td>
      </tr>
      `;
   });

   document.getElementById('tableCicilan')
   .innerHTML = html;
}

/* DROPDOWN */

async function loadDropdownPeminjam(){

   const res =
   await fetch(API_URL + '?action=getPinjaman');

   const data =
   await res.json();

   let html =
   '<option>Pilih Peminjam</option>';

   data.forEach(item=>{

      if(Number(item.sisa) > 0){

         html += `
         <option value="${item.id}">

            ${item.nama}
            - Sisa:
            ${rupiah(item.sisa)}

         </option>
         `;
      }

   });

   document.getElementById('idPeminjam')
   .innerHTML = html;
}

/* =========================
   FILTER KAS
========================= */

function filterKas(){

     let data =
   [...kasData];
   
   let tglAwal =
   document
   .getElementById('tglAwalKas')
   .value;

   let tglAkhir =
   document
   .getElementById('tglAkhirKas')
   .value;
   
   let cari =
   document
   .getElementById('searchKas')
   .value
   .toLowerCase();
/* =========================
   FILTER TANGGAL
========================= */

   if(tglAwal && tglAkhir){

      data = data.filter(item=>{

         let tgl =
         item.tanggal.split(' ')[0];

         let p =
         tgl.split('/');
   
         let format =
         `${p[2]}-${p[1]}-${p[0]}`;

            return (
            format >= tglAwal &&
            format <= tglAkhir
         );
      });
   }
   let sort =
   document
   .getElementById('sortKas')
   .value;

   
 

   if(cari){

      data = data.filter(item=>

         item.keterangan
         .toLowerCase()
         .includes(cari)
      );
   }

   if(sort == 'baru'){

      data.reverse();
   }

   let html='';

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
   FILTER PINJAMAN
========================= */

function filterPinjaman(){

   let cari =
   document
   .getElementById('searchPinjaman')
   .value
   .toLowerCase();

   let status =
   document
   .getElementById('statusPinjaman')
   .value;

   let data =
   [...pinjamanData];

   if(cari){

      data = data.filter(item=>

         item.nama
         .toLowerCase()
         .includes(cari)
      );
   }

   if(status){

      data = data.filter(item=>

         item.status == status
      );
   }

   let html='';

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
         ? '#16a34a'
         : '#dc2626'};
         font-weight:bold;
         ">

         ${item.status}

         </td>
<td>

<button
onclick="editPinjaman('${item.row}')">

Edit

</button>

<button
onclick="hapusPinjaman('${item.row}')">

Hapus

</button>

</td>
      </tr>
      `;
   });

   document.getElementById('tablePinjaman')
   .innerHTML = html;
}

/* =========================
   FILTER CICILAN
========================= */

function filterCicilan(){

   let cari =
   document
   .getElementById('searchCicilan')
   .value
   .toLowerCase();

   let data =
   [...cicilanData];

   if(cari){

      data = data.filter(item=>

         String(item.id)
         .toLowerCase()
         .includes(cari)
      );
   }

   let html='';

   data.forEach(item=>{

      html += `
      <tr>

         <td>${item.tanggal}</td>

         <td>${item.id}</td>

         <td>${item.cicilan}</td>

         <td>${rupiah(item.bayar)}</td>

         <td>${rupiah(item.sisa)}</td>
<td>

<button
onclick="editCicilan('${item.rowid}')">

Edit

</button>

<button
onclick="hapusCicilan('${item.rowid}')">

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
   EDIT KAS
========================= */

function editKas(id){

   let item =
   kasData.find(x=>x.row == id);
   let tgl =
   item.tanggal.split(' ')[0];
   let pecah =
   tgl.split('/');
   document.getElementById('tglKas').value =
   `${pecah[2]}-${pecah[1]}-${pecah[0]}`;

   document.getElementById('nominalMasuk').value =
   item.masuk;

   document.getElementById('nominalKeluar').value =
   item.keluar;

   document.getElementById('sumberMasuk').value =
   item.sumberMasuk;

   document.getElementById('sumberKeluar').value =
   item.sumberKeluar;

   document.getElementById('ketKas').value =
   item.keterangan;

   localStorage.setItem('editKas',id);
}

/* =========================
   EDIT PINJAMAN
========================= */

function editPinjaman(id){

   let item =
   pinjamanData.find(x=>x.row == id);

   document.getElementById('namaPinjam').value =
   item.nama;

   document.getElementById('hpPinjam').value =
   item.hp;

   document.getElementById('alamatPinjam').value =
   item.alamat;

   document.getElementById('totalPinjam').value =
   item.total;

   localStorage.setItem('editPinjaman',id);
}

/* =========================
   EDIT CICILAN
========================= */

function editCicilan(id){

   let item =
   cicilanData.find(x=>x.rowid == id);

   document.getElementById('cicilanKe').value =
   item.cicilan;

   document.getElementById('bayarNominal').value =
   item.bayar;

   localStorage.setItem('editCicilan',id);
}
/* =========================
   PRINT KAS
========================= */

function printKas(){

   let rows = '';

   kasData.forEach(item=>{

      rows += `

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

   let win =
   window.open('','','width=1200,height=700');

   win.document.write(`

   <html>

   <head>

      <title>
      Laporan Uang Kas
      </title>

      <style>

      body{

         font-family:Arial;
         padding:20px;
      }

      h2{

         margin-bottom:20px;
      }

      table{

         width:100%;
         border-collapse:collapse;
      }

      th,td{

         border:1px solid #ccc;
         padding:10px;
         text-align:left;
      }

      th{

         background:#f3f4f6;
      }

      </style>

   </head>

   <body>

      <h2>
      LAPORAN UANG KAS
      </h2>

      <table>

         <thead>

            <tr>

               <th>Tanggal</th>
               <th>Masuk</th>
               <th>Keluar</th>
               <th>Sumber Masuk</th>
               <th>Sumber Keluar</th>
               <th>Keterangan</th>

            </tr>

         </thead>

         <tbody>

            ${rows}

         </tbody>

      </table>

   </body>

   </html>
   `);

   win.document.close();

   win.focus();

   win.print();
}

/* =========================
   PRINT PINJAMAN
========================= */

function printPinjaman(){

   let isi =
   document.getElementById('tablePinjaman')
   .innerHTML;

   let win =
   window.open('','','width=1000,height=700');

   win.document.write(`

   <html>

   <head>

      <title>
      Data Pinjaman
      </title>

      <style>

      body{

         font-family:Arial;
         padding:20px;
      }

      table{

         width:100%;
         border-collapse:collapse;
      }

      th,td{

         border:1px solid #ccc;
         padding:10px;
      }

      th{

         background:#f3f4f6;
      }

      </style>

   </head>

   <body>

      <h2>
      DATA PINJAMAN
      </h2>

      <table>

         <thead>

            <tr>

               <th>Nama</th>
               <th>Total</th>
               <th>Sudah Bayar</th>
               <th>Sisa</th>
               <th>Status</th>

            </tr>

         </thead>

         <tbody>

            ${isi}

         </tbody>

      </table>

   </body>

   </html>
   `);

   win.document.close();

   win.print();
}

/* =========================
   PRINT CICILAN
========================= */

function printCicilan(){

   let isi =
   document.getElementById('tableCicilan')
   .innerHTML;

   let win =
   window.open('','','width=1000,height=700');

   win.document.write(`

   <html>

   <head>

      <title>
      Data Cicilan
      </title>

      <style>

      body{

         font-family:Arial;
         padding:20px;
      }

      table{

         width:100%;
         border-collapse:collapse;
      }

      th,td{

         border:1px solid #ccc;
         padding:10px;
      }

      th{

         background:#f3f4f6;
      }

      </style>

   </head>

   <body>

      <h2>
      DATA CICILAN
      </h2>

      <table>

         <thead>

            <tr>

               <th>Tanggal</th>
               <th>Peminjam</th>
               <th>Cicilan</th>
               <th>Bayar</th>
               <th>Sisa</th>

            </tr>

         </thead>

         <tbody>

            ${isi}

         </tbody>

      </table>

   </body>

   </html>
   `);

   win.document.close();

   win.print();
}
async function simpanPinjaman(){

   try{

      const nama =
      document.getElementById('namaPinjam').value;

      const hp =
      document.getElementById('hpPinjam').value;

      const alamat =
      document.getElementById('alamatPinjam').value;

      const total =
      document.getElementById('totalPinjam').value;

      const lama =
      document.getElementById('lamaCicilan').value;

      const res =
      await fetch(API_URL,{

         method:'POST',

         body:JSON.stringify({

            action:'tambahPinjaman',

            editId:
            localStorage.getItem('editPinjaman'),

            nama:nama,

            hp:hp,

            alamat:alamat,

            total:total,

            lama:lama
         })
      });

      const text =
      await res.text();

      console.log(text);

      let hasil;

      try{

         hasil =
         JSON.parse(text);

      }catch{

         alert(
         'Response Apps Script bukan JSON'
         );

         return;
      }

      if(hasil.status == 'error'){

         alert(hasil.message);

         return;
      }

      alert('Data berhasil disimpan');

      localStorage.removeItem('editPinjaman');

      document.getElementById('namaPinjam').value='';

      document.getElementById('hpPinjam').value='';

      document.getElementById('alamatPinjam').value='';

      document.getElementById('totalPinjam').value='';

      document.getElementById('lamaCicilan').value='';

      loadPinjaman();

      loadDashboard();

   }catch(err){

      console.log(err);

      alert(
      'Gagal simpan pinjaman'
      );
   }
}
/* =========================
   HAPUS PINJAMAN
========================= */

async function hapusPinjaman(id){

   let yakin =
   confirm('Hapus data pinjaman?');

   if(!yakin) return;

   try{

      await fetch(API_URL,{

         method:'POST',

         body:JSON.stringify({

            action:'hapusPinjaman',

            id:id
         })
      });

      alert('Data berhasil dihapus');

      loadPinjaman();

      loadDashboard();

   }catch(err){

      console.log(err);

      alert('Gagal hapus pinjaman');
   }
}

/* =========================
   HAPUS CICILAN
========================= */

async function hapusCicilan(id){

   let yakin =
   confirm('Hapus data cicilan?');

   if(!yakin) return;

   try{

      await fetch(API_URL,{

         method:'POST',

         body:JSON.stringify({

            action:'hapusCicilan',

            id:id
         })
      });

      alert('Data berhasil dihapus');

      loadCicilan();

      loadPinjaman();

      loadDashboard();

   }catch(err){

      console.log(err);

      alert('Gagal hapus cicilan');
   }
}

/* =========================
   HAPUS UANG KAS
========================= */

async function hapusKas(id){

   let yakin =
   confirm('Hapus data uang kas?');

   if(!yakin) return;

   try{

      await fetch(API_URL,{

         method:'POST',

         body:JSON.stringify({

            action:'hapusKas',

            id:id
         })
      });

      alert('Data berhasil dihapus');

      loadKas();

      loadDashboard();

   }catch(err){

      console.log(err);

      alert('Gagal hapus uang kas');
   }
}
function uploadExcel(){

   let file =
   document.getElementById('fileExcel').files[0];

   if(!file){

      alert('Pilih file Excel dulu');

      return;
   }

   uploadBtn =
   document.querySelector(
   '#uploadGaji button'
   );

   uploadBtn.innerHTML =
   '<i class="fa-solid fa-spinner fa-spin"></i> Processing Payroll...';

   uploadBtn.disabled = true;

   let reader =
   new FileReader();

   reader.onload = function(e){

      let data =
      new Uint8Array(e.target.result);

      let workbook =
      XLSX.read(data,{
         type:'array'
      });

      let sheetName =
      workbook.SheetNames[0];

      if(sheetName != 'DATA_GAJI'){

         alert(
         'Nama sheet wajib DATA_GAJI'
         );

         uploadBtn.innerHTML =
         'Upload & Proses';

         uploadBtn.disabled = false;

         return;
      }

      let worksheet =
      workbook.Sheets[sheetName];

      let json =
      XLSX.utils.sheet_to_json(
         worksheet
      );

      prosesPayroll(json);

   };

   reader.readAsArrayBuffer(file);
}

function tampilMonitoring(data){

   loadPayroll();

   showPage('monitoringGaji');

   alert(
   'Payroll berhasil diproses'
   );
}
function prosesPayroll(data){

let periodeInput =
document.getElementById('uploadPeriode');

let periode = '';

if(periodeInput){

   periode = periodeInput.value;
}
   let hasil = {};

  data.forEach(item=>{

   let nama =
   item.NAMA_TEKNISI;

   if(!hasil[nama]){

   hasil[nama] = {

   nama:nama,

   periode:periode,

   status:'BELUM TRANSFER',

   totalSC:0,

   jumlahOrder:0,

   bonus:0,

   lembur:0,

   potongan:0,

   totalGaji:0
	};
   }

   let totalSC =
   Number(item.QTY || 0)
   * 120000;

   hasil[nama].totalSC +=
   totalSC;

   hasil[nama].jumlahOrder +=
   Number(item.QTY || 0);

   hasil[nama].bonus +=
   Number(item.BONUS || 0);

   hasil[nama].lembur +=
   Number(item.LEMBUR || 0);

   hasil[nama].potongan +=
   Number(item.POTONGAN || 0);

   hasil[nama].totalGaji =

   hasil[nama].totalSC +

   hasil[nama].bonus +

   hasil[nama].lembur -

   hasil[nama].potongan;
});

let finalData =
Object.values(hasil);

finalData.forEach(item=>{

   item.periode = periode;
});

fetch(API_URL,{

   method:'POST',

	body:JSON.stringify({

	action:'simpanPayroll',
	
	periode:periode,

	   items:finalData
	})
})
.then(res=>res.json())
.then(res=>{

   tampilMonitoring(finalData);

   uploadBtn.innerHTML =
   'Upload & Proses';

   uploadBtn.disabled = false;
});
}
function loadPayroll(){

   fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'getPayroll'
      })
   })
   .then(res=>res.json())
   .then(data=>{

      if(!Array.isArray(data)){

         console.log(data);

         return;
      }
      let html='';

      data.reverse().forEach(item=>{

html += `

<tr>

   <td>
   ${formatTanggal(item.tanggal)}
   </td>
   
	<td>
	${item.periode}
	</td>
	
   <td>
   ${item.nama}
   </td>

   <td>
   ${item.bank}
   </td>

   <td>
   ${item.rekening}
   </td>

   <td>
   ${rupiah(item.totalSC)}
   </td>

   <td>
   ${item.jumlahOrder} SC
   </td>

   <td>
   ${rupiah(item.bonus)}
   </td>

   <td>
   ${rupiah(item.lembur)}
   </td>

   <td>
   ${rupiah(item.potongan)}
   </td>

   <td>
   ${rupiah(item.totalGaji)}
   </td>

   <td>

      <button
      onclick="ubahStatusGaji('${item.id}','${item.status}')"
      class="${
      item.status == 'SUDAH TRANSFER'
      ?
      'status-lunas'
      :
      'status-belum'
      }">

      ${item.status}

      </button>

   </td>

</tr>
`;
      });

      document.getElementById(
      'tableGaji'
      ).innerHTML = html;
   })
   .catch(err=>{

      console.log(err);
   });
}

function filterMonitoringGaji(){

   let periode =
   document.getElementById(
   'filterPeriodeGaji'
   ).value
   .trim();

   let nama =
   document.getElementById(
   'filterNamaGaji'
   ).value
   .toUpperCase()
   .trim();

   let rows =
   document.querySelectorAll(
   '#tableGaji tr'
   );

   rows.forEach(row=>{

      let text =
      row.innerText.toUpperCase();

      let tampil = true;

      if(
      nama &&
      !text.includes(nama)
      ){

         tampil = false;
      }

      let periodeRow =
      row.children[1]
      .innerText
      .trim();

      if(
      periode &&
      periodeRow !== periode
      ){

         tampil = false;
      }

      row.style.display =
      tampil
      ?
      ''
      :
      'none';
   });
}

function ubahStatusGaji(id,status){

   let statusBaru =
   status == 'BELUM TRANSFER'
   ?
   'SUDAH TRANSFER'
   :
   'BELUM TRANSFER';

   fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'ubahStatusGaji',

         id:id,

         status:statusBaru
      })
   })
   .then(res=>res.json())
   .then(res=>{

      loadPayroll();
   });
}
async function loadTeknisi(){

   let res =
   await fetch(
   API_URL +
   '?action=getTeknisi'
   );

   let data =
   await res.json();

   let html='';

   data.reverse().forEach(item=>{

      html += `

      <tr>

         <td>${item.id}</td>

         <td>${item.nama}</td>

         <td>${item.jabatan}</td>

         <td>${item.area}</td>

         <td>${item.hp}</td>

         <td>${item.bank}</td>

         <td>${item.rekening}</td>

         <td>${item.status}</td>

         <td>

            <button
            onclick="editTeknisi('${item.row}')">
            Edit
            </button>

            <button
            onclick="hapusTeknisi('${item.row}')">
            Hapus
            </button>

         </td>

      </tr>
      `;
   });

   document.getElementById(
   'tableTeknisi'
   ).innerHTML = html;
}
async function simpanTeknisi(){

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'simpanTeknisi',

         nama:
         document.getElementById(
         'teknisiNama'
         ).value,

         jabatan:
         document.getElementById(
         'teknisiJabatan'
         ).value,

         area:
         document.getElementById(
         'teknisiArea'
         ).value,

         hp:
         document.getElementById(
         'teknisiHp'
         ).value,

         bank:
         document.getElementById(
         'teknisiBank'
         ).value,

         rekening:
         document.getElementById(
         'teknisiRekening'
         ).value,

         status:
         document.getElementById(
         'teknisiStatus'
         ).value
      })
   });

   loadTeknisi();
   alert('Teknisi berhasil disimpan');
}
function filterTeknisi(){

   let cari =
   document.getElementById(
   'searchTeknisi'
   ).value.toLowerCase();

   let rows =
   document.querySelectorAll(
   '#tableTeknisi tr'
   );

   rows.forEach(row=>{

      let nama =
      row.children[1]
      .innerText
      .toLowerCase();

      if(nama.includes(cari)){

         row.style.display='';

      }else{

         row.style.display='none';
      }
   });
}
function editTeknisi(id){

   let rows =
   document.querySelectorAll(
   '#tableTeknisi tr'
   );

   rows.forEach(row=>{

      let btn =
      row.querySelector('button');

      if(
      btn &&
      btn.getAttribute('onclick')
      .includes(id)
      ){

         document.getElementById(
         'editTeknisiId'
         ).value = id;

         document.getElementById(
         'teknisiNama'
         ).value =
         row.children[1].innerText;

         document.getElementById(
         'teknisiJabatan'
         ).value =
         row.children[2].innerText;

         document.getElementById(
         'teknisiArea'
         ).value =
         row.children[3].innerText;

         document.getElementById(
         'teknisiHp'
         ).value =
         row.children[4].innerText;

         document.getElementById(
         'teknisiBank'
         ).value =
         row.children[5].innerText;

         document.getElementById(
         'teknisiRekening'
         ).value =
         row.children[6].innerText;

         document.getElementById(
         'teknisiStatus'
         ).value =
         row.children[7].innerText;
      }
   });
}
async function hapusTeknisi(id){

   let yakin =
   confirm('Hapus teknisi?');

   if(!yakin) return;

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'hapusTeknisi',

         id:id
      })
   });

   loadTeknisi();
}
async function loadSlipNama(){

   let res =
   await fetch(
   API_URL +
   '?action=getTeknisi'
   );

   let data =
   await res.json();

   let html =
   '<option value="">Pilih Teknisi</option>';

   data.forEach(item=>{

      html += `

      <option value="${item.nama}">

      ${item.nama}

      </option>
      `;
   });

   document.getElementById(
   'slipNama'
   ).innerHTML = html;
}

async function buatSlipGaji(){

   let nama =
   document.getElementById(
   'slipNama'
   ).value;

   let bulan =
   document.getElementById(
   'slipBulan'
   ).value;

   if(!nama){

      alert('Pilih teknisi');

      return;
   }

   if(!bulan){

      alert('Pilih periode bulan');

      return;
   }

	let arrBulan = [

   'Januari',
   'Februari',
   'Maret',
   'April',
   'Mei',
   'Juni',
   'Juli',
   'Agustus',
   'September',
   'Oktober',
   'November',
   'Desember'
	];

	let split =
	bulan.split('-');

	let periode =
	arrBulan[
	Number(split[1]) - 1
	] + ' ' + split[0];

	let res =
	await fetch(API_URL,{

	method:'POST',

	body:JSON.stringify({

      action:'getPayroll'

	})
	});

	let data =
	await res.json();
	console.log(data);

let item =
data.find(x => {

   let namaData =
   String(x.nama)
   .trim()
   .toUpperCase();

   let namaPilih =
   String(nama)
   .trim()
   .toUpperCase();

   let periodeData =
   String(x.periode)
   .trim()
   .replace(/\s/g,'');

   let periodePilih =
   String(bulan)
   .trim()
   .replace(/\s/g,'');

   console.log(
   namaData,
   namaPilih,
   periodeData,
   periodePilih
   );

   return (

      namaData === namaPilih

      &&

      periodeData.includes(
      periodePilih
      )

   );

});
   if(!item){

      alert(
      'Slip tidak ditemukan'
      );

      return;
   }

   document.getElementById(
   'hasilSlip'
   ).innerHTML = `

   <div class="slip-box">

      <div class="slip-header">

         <h2>
         KAS ARIP R.COM
         </h2>

         <h3>
         SLIP GAJI TEKNISI
         </h3>

         <p class="periode-slip">

         PERIODE :
         ${periode.toUpperCase()}

         </p>

      </div>

      <div class="slip-body">

         <div class="slip-row">
            <span>Nama</span>
            <b>${item.nama}</b>
         </div>

         <div class="slip-row">
            <span>Bank</span>
            <b>${item.bank}</b>
         </div>

         <div class="slip-row">
            <span>No Rekening</span>
            <b>${item.rekening}</b>
         </div>

         <div class="slip-row">
            <span>Jumlah Order</span>
            <b>${item.jumlahOrder} SC</b>
         </div>

         <div class="slip-row">
            <span>Total SC</span>
            <b>${rupiah(item.totalSC)}</b>
         </div>

         <div class="slip-row">
            <span>Bonus</span>
            <b>${rupiah(item.bonus)}</b>
         </div>

         <div class="slip-row">
            <span>Lembur</span>
            <b>${rupiah(item.lembur)}</b>
         </div>

         <div class="slip-row">
            <span>Potongan</span>
            <b>${rupiah(item.potongan)}</b>
         </div>

      </div>

      <div class="slip-total">

         TOTAL GAJI

         <h1>
         ${rupiah(item.totalGaji)}
         </h1>

      </div>

      <div class="slip-status">

         ${item.status}

      </div>

   </div>
   `;
}
function printSlip(){

   let content =
   document.getElementById(
   'hasilSlip'
   ).innerHTML;

   let win =
   window.open('','','width=900,height=700');

   win.document.write(`

   <html>

   <head>

      <title>
      Slip Gaji
      </title>

      <style>

         body{

            font-family:Arial;

            background:#f1f5f9;

            padding:30px;
         }

         .slip-box{

            max-width:700px;

            margin:auto;

            background:#fff;

            border-radius:25px;

            overflow:hidden;

            box-shadow:
            0 10px 30px rgba(0,0,0,0.1);
         }

         .slip-header{

            background:
            linear-gradient(
            135deg,
            #0f172a,
            #1e3a8a
            );

            color:#fff;

            padding:30px;

            text-align:center;
         }

         .slip-body{

            padding:30px;
         }

         .slip-row{

            display:flex;

            justify-content:space-between;

            margin-bottom:15px;

            border-bottom:
            1px dashed #ddd;

            padding-bottom:10px;
         }

         .slip-total{

            background:#f8fafc;

            padding:30px;

            text-align:center;
         }

         .slip-total h1{

            color:#2563eb;
         }

         .slip-status{

            padding:20px;

            text-align:center;

            color:#fff;

            font-weight:bold;

            background:#22c55e;
         }

      </style>

   </head>

   <body>

   ${content}

   </body>

   </html>
   `);

   win.document.close();

   win.print();
}
