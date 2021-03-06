const signupButton = document.getElementById('btn-sign');

signupButton.addEventListener('click', async function(event){

  event.preventDefault();

  const firstName=document.getElementById("firstName").value;
  const lastName=document.getElementById("lastName").value;
  const email=document.getElementById("email").value;
  const password=document.getElementById("pwd").value;
  const confirmPassword=document.getElementById("confirmPwd").value;
  const checkbox = document.getElementById("checkbox");
  const fullName=firstName+lastName;
  const mailRegex = '[a-z0-9]+@[a-z]+\.[a-z]{2,3}';
  const labelForMail = document.getElementById("label-for-mail");

  if(!email.match(mailRegex)) {
    labelForMail.innerHTML = "invalid email Id";
    showAlert('Invalid Email')
  }
  else if(!email.match(mailRegex)) {
    labelForMail.innerHTML = "invalid email Id";
  }
  
  else if(password != confirmPassword) {
    showAlert('Passwords don\'t match')
  }
  else if(!checkbox.checked) {
    showAlert('Please Accept Our T&C')
  }
  else{
    const signUpApi = 'http://localhost:8090/api/v1/registration';
    const response = await fetch(signUpApi,{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {
          'name': fullName,
          'email': email,
          'password': password
        })
    })

    var data = await response.json();
    validate(data.name, data.email);

    // if response is okay 
    if(response.status >= 200 && response.status < 300) {
      showAlert("Welcome to Grandeur, "+data.name+"!\nPlease verify your email address in the inbox.");
      window.location.replace("https://mail.google.com/");
    }
    
    if(response.status >= 400 && response.status < 500){
      // checking if the email already exists // 
      if(data.error == 'Conflict'){
        showAlert('the email '+email+' already exists.\nPlease try again ('+response.status+')');
      }
      else{
        showAlert(response.error);
      }
    }
    // 
    if(response.status >= 500 && response.status < 600) {
      showAlert("Internal server error! "+response.error+"\n"+response.status);
    }
  }
});


function validate(name, email){
  const localName = localStorage.getItem('name');
  const localEmail = localStorage.getItem('email');

  if(localName != name && localEmail != email){
    localStorage.setItem('name',name);
    localStorage.setItem('email',email);
  }
}

function showAlert(message){
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    background : '#EE7600',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  Toast.fire({
    title: '',
    text: message,
    color: '#000000'
  })
  }
