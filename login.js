function login(){

  let username =
  document.getElementById('username')
  .value
  .trim();

  let password =
  document.getElementById('password')
  .value
  .trim();

  if(
     username === 'Arip'
     &&
     password === 'arip007'
  ){

      localStorage.setItem(
      'login',
      'true'
      );

      window.location='index.html';

  }else{

      alert(
      'Username atau password salah'
      );
  }
}
