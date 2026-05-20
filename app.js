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

   document.getElementById(id)
   .style.display='block';
}

/* DEFAULT PAGE */

window.onload = function(){

   showPage('dashboard');

   loadDashboard();

   loadKas();

   loadPinjaman();

   loadCicilan();

   loadDropdownPeminjam();
	loadPayroll();
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
function formatTanggal(tanggal){

   return new Date(tanggal)
   .toLocaleDateString('id-ID');
}
   return 'Rp ' +
   Number(angka || 0)
   .toLocaleString('id-ID');
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

/* HAPUS CICILAN */

async function hapusCicilan(id){

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'hapusCicilan',

         id:id
      })
   });

   loadCicilan();

   loadPinjaman();

   loadDashboard();
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
   HAPUS KAS
========================= */

async function hapusKas(id){

   if(!confirm('Hapus data?')){
      return;
   }

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify({

         action:'hapusKas',

         id:id
      })
   });

   loadKas();

   loadDashboard();
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

   let html='';

   data.forEach(item=>{

      html += `

      <tr>

         <td>
         ${new Date().toLocaleDateString('id-ID')}
         </td>

         <td>
         ${item.nama}
         </td>

         <td>
         Rp ${formatRupiah(item.totalSC)}
         </td>

         <td>
         Rp ${formatRupiah(item.bonus)}
         </td>

         <td>
         Rp ${formatRupiah(item.lembur)}
         </td>

         <td>
         Rp ${formatRupiah(item.potongan)}
         </td>

         <td>
         Rp ${formatRupiah(item.totalGaji)}
         </td>

         <td>

            <span class="status-belum">

            BELUM TRANSFER

            </span>

         </td>

      </tr>

      `;
   });

   document.getElementById(
   'tableGaji'
   ).innerHTML = html;

   showPage('monitoringGaji');

   alert(
   'Payroll berhasil diproses'
   );
}
function prosesPayroll(data){

   let hasil = {};

   data.forEach(item=>{

      let nama =
      item.NAMA_TEKNISI;

      let qty =
      Number(item.QTY || 0);

      let bonus =
      Number(item.BONUS || 0);

      let lembur =
      Number(item.LEMBUR || 0);

      let potongan =
      Number(item.POTONGAN || 0);

      let tarif = 120000;

      let totalSC =
      qty * tarif;

      let totalGaji =
      totalSC +
      bonus +
      lembur -
      potongan;

      if(!hasil[nama]){

         hasil[nama]={

            nama:nama,

            totalSC:0,

            bonus:0,

            lembur:0,

            potongan:0,

            totalGaji:0
         };
      }

      hasil[nama].totalSC += totalSC;

      hasil[nama].bonus += bonus;

      hasil[nama].lembur += lembur;

      hasil[nama].potongan += potongan;

      hasil[nama].totalGaji += totalGaji;

   });

let finalData =
Object.values(hasil);

fetch(API_URL,{

   method:'POST',

   body:JSON.stringify({

      action:'simpanPayroll',

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

      let html='';

      data.reverse().forEach(item=>{

         html += `

         <tr>

            <td>
            ${formatTanggal(item.tanggal)}
            </td>

            <td>
            ${item.nama}
            </td>

            <td>
            ${rupiah(item.totalSC)}
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

               <span class="${
               item.status ==
               'SUDAH TRANSFER'
               ?
               'status-lunas'
               :
               'status-belum'
               }">

               ${item.status}

               </span>

            </td>

         </tr>
         `;
      });

      document.getElementById(
      'tableGaji'
      ).innerHTML = html;
   });
}
