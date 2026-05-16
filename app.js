```javascript
const API_URL =
'https://script.google.com/macros/s/AKfycbx0nv2PTvEZMoR5bQUl8WV5ckTI56RrZmvPo-v_NGiHjiX-IkgCyBkmLwcyT5Vu6gRg/exec';

/* =========================
   PAGE
========================= */

function showPage(id){

   document
   .querySelectorAll('.page')
   .forEach(page=>{

      page.style.display='none';
   });

   document.getElementById(id)
   .style.display='block';
}

/* =========================
   DEFAULT
========================= */

window.onload = function(){

   showPage('dashboard');

   loadDashboard();

   loadKas();

   loadPinjaman();

   loadCicilan();

   loadDropdownPeminjam();
};

/* =========================
   LOGOUT
========================= */

function logout(){

   localStorage.clear();

   window.location='login.html';
}

/* =========================
   RUPIAH
========================= */

function rupiah(angka){

   return 'Rp ' +
   Number(angka || 0)
   .toLocaleString('id-ID');
}

/* =========================
   DASHBOARD
========================= */

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

/* =========================
   UANG KAS
========================= */

async function simpanKas(){

   let data = {

      action:'tambahKas',

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

   loadKas();

   loadDashboard();
}

async function loadKas(){

   const res =
   await fetch(API_URL + '?action=getKas');

   const data =
   await res.json();

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
   PINJAMAN
========================= */

async function simpanPinjaman(){

   let data = {

      action:'tambahPinjaman',

      nama:
      document.getElementById('namaPinjam').value,

      hp:
      document.getElementById('hpPinjam').value,

      alamat:
      document.getElementById('alamatPinjam').value,

      total:
      document.getElementById('totalPinjam').value
   };

   await fetch(API_URL,{

      method:'POST',

      body:JSON.stringify(data)
   });

   loadPinjaman();

   loadDropdownPeminjam();

   loadDashboard();
}

async function loadPinjaman(){

   const res =
   await fetch(API_URL + '?action=getPinjaman');

   const data =
   await res.json();

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
            ? 'limegreen'
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
   CICILAN
========================= */

async function bayarCicilan(){

   let data = {

      action:'bayarCicilan',

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

   loadCicilan();

   loadPinjaman();

   loadDashboard();

   loadDropdownPeminjam();
}

async function loadCicilan(){

   const res =
   await fetch(API_URL + '?action=getCicilan');

   const data =
   await res.json();

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

/* =========================
   DROPDOWN
========================= */

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
```
