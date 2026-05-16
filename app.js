function showPage(id){

  const pages = document.querySelectorAll('.page');

  pages.forEach(p=>{
    p.style.display='none';
  });

  document.getElementById(id).style.display='block';
}

showPage('dashboard');

/* LOGOUT */
function logout(){

   localStorage.clear();

   window.location='login.html';
}

/* CHART */

const ctx = document.getElementById('myChart');

new Chart(ctx, {

  type: 'bar',

  data: {

    labels: ['Kas Masuk', 'Kas Keluar'],

    datasets: [{

      label: 'Statistik',

      data: [5000000, 2000000]

    }]
  }
});

/* TOTAL */
let totalMasuk = 0;
let totalKeluar = 0;
let totalPiutang = 0;

/* KAS MASUK */

function simpanKasMasuk(){

   let tanggal = document.getElementById('tglMasuk').value;

   let nominal = Number(document.getElementById('nominalMasuk').value);

   let keterangan = document.getElementById('ketMasuk').value;

   let tr = `
      <tr>
         <td>${tanggal}</td>
         <td>Rp ${nominal.toLocaleString()}</td>
         <td>${keterangan}</td>
      </tr>
   `;

   document.getElementById('tableKasMasuk').innerHTML += tr;

   totalMasuk += nominal;

   document.getElementById('totalMasuk').innerHTML =
   'Rp ' + totalMasuk.toLocaleString();
}

/* KAS KELUAR */

function simpanKasKeluar(){

   let tanggal = document.getElementById('tglKeluar').value;

   let nominal = Number(document.getElementById('nominalKeluar').value);

   let keterangan = document.getElementById('ketKeluar').value;

   let tr = `
      <tr>
         <td>${tanggal}</td>
         <td>Rp ${nominal.toLocaleString()}</td>
         <td>${keterangan}</td>
      </tr>
   `;

   document.getElementById('tableKasKeluar').innerHTML += tr;

   totalKeluar += nominal;

   document.getElementById('totalKeluar').innerHTML =
   'Rp ' + totalKeluar.toLocaleString();
}

/* PINJAMAN */

function simpanPinjaman(){

   let nama = document.getElementById('namaPinjam').value;

   let total = Number(document.getElementById('totalPinjam').value);

   let tr = `
      <tr>
         <td>${nama}</td>
         <td>Rp ${total.toLocaleString()}</td>
         <td style="color:red;">
            BELUM LUNAS
         </td>
      </tr>
   `;

   document.getElementById('tablePinjaman').innerHTML += tr;

   totalPiutang += total;

   document.getElementById('sisaPiutang').innerHTML =
   'Rp ' + totalPiutang.toLocaleString();
}
