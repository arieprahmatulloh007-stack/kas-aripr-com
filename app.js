function showPage(id){
  const pages = document.querySelectorAll('.page');

  pages.forEach(p=>{
    p.style.display='none';
  });

  document.getElementById(id).style.display='block';
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
