function login(){

  let username = document.getElementById('username').value;

  let password = document.getElementById('password').value;

  if(username == 'admin' && password == 'admin123'){

      localStorage.setItem('login','true');

      window.location='index.html';

  }else{

      alert('Username atau password salah');

  }

}
