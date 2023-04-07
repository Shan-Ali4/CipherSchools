const wrapper = document.querySelector('.wrapper')
const loginLink = document.querySelector('.login-link')
const registerLink = document.querySelector('.register-link')
const btnPopup = document.querySelector('#btnpop')
const iconClose = document.querySelector('.icon-close')
const updateOnIcon = document.getElementById('update-on');
const updateFormWrapper = document.querySelector('.wrapper-form');

updateOnIcon.addEventListener('click', () => {
  updateFormWrapper.style.display = 'block';
});


const closeIcon = document.querySelector('.icon-close2');

closeIcon.addEventListener('click', () => {
  updateFormWrapper.style.display = 'none';
});

registerLink.addEventListener('click',()=>{
    wrapper.classList.add('active')
})

loginLink.addEventListener('click',()=>{
    wrapper.classList.remove('active')
})

btnPopup.addEventListener('click',()=>{
    wrapper.classList.add('active-popup')
})

iconClose.addEventListener('click',()=>{
    wrapper.classList.remove('active-popup')
})


const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

// handle login form submission
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent default form submission behavior
  const email = document.querySelector('#email-login').value;
  const password = document.querySelector('#password-login').value;
  try {
    const response = await fetch('https://kind-jade-salmon-gown.cyclic.app/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    alert("Login Done")
    // save token in local storage
    sessionStorage.setItem('token', data.token);
    window.location.href = 'index.html'
    // redirect to home page or do other actions as needed
  } catch (error) {
    console.error(error);
    // handle error, e.g. show error message to user
  }
});


// handle registration form submission
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // prevent default form submission behavior
  const username = document.querySelector('#name-reg').value;
  const email = document.querySelector('#email-reg').value;
  const mobileNum = document.querySelector('#tel-reg').value;
  const password = document.querySelector('#password-reg').value;
  // const agreeTerms = document.querySelector('#agree-terms').checked;
  try {
    const response = await fetch('https://kind-jade-salmon-gown.cyclic.app/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, mobileNum, password })
    });
    const data = await response.json();
    console.log(data)
    alert("Data Added")
    // handle successful registration, e.g. show success message to user
  } catch (error) {
    alert("There Is Error")
    console.error(error);
    // handle error, e.g. show error message to user
  }
});

if (sessionStorage.getItem("token")) {
  // retrieve user information from session storage
  const name = sessionStorage.getItem("name");
  const email = sessionStorage.getItem("email");

  // update HTML elements with user information
  document.getElementById("name-user").textContent = name;
  document.getElementById("email-user").textContent = email;
}

