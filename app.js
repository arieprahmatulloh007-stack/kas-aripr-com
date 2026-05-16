function showPage(id){
  const pages = document.querySelectorAll('.page');
  const API_URL = 'https://script.google.com/macros/s/AKfycbx0nv2PTvEZMoR5bQUl8WV5ckTI56RrZmvPo-v_NGiHjiX-IkgCyBkmLwcyT5Vu6gRg/exec';
  pages.forEach(p=>{
    p.style.display='none';
  });

  document.getElementById(id).style.display='block';
}
function simpanKasMasuk(){

   let data = {
      tanggal : document.getElementById('tglMasuk').value,
      nominal : document.getElementById('nominalMasuk').value,
      keterangan : document.getElementById('ketMasuk').value
   };

   console.log(data);

   alert('Data berhasil disimpan');
}
showPage('dashboard');

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
