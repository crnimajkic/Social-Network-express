let thisSession = new Session()
sessionCookies = thisSession.getSession()

if (sessionCookies !== '') {
    window.location.href = '/hexa.html'
}

document.querySelector('#registerHere').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'block'
})

document.querySelector('#closeModal').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'none'
})

let config = {
    'username': {
        required: true,
        minlength: 5,
        maxlength: 50
    },
    'email': {
        reguired: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },
    'password': {
        required: true,
        minlength: 5,
        maxlength: 50,
        matching: 'repeat_password'
    },
    'repeat_password': {
        required: true,
        minlength: 5,
        maxlength: 50,
        matching: 'password'
    }
};

let validator = new Validator(config, '#registrationForm')

document.querySelector('#registrationForm').addEventListener('submit', e => {
    e.preventDefault();

    if (validator.validationPassed()) {
        let user = new User()
        user.username = document.querySelector('#username').value
        user.password = document.querySelector('#password').value
        user.email = document.querySelector('#email').value
        user.create()
    } else {
        alert('Something is wrong, you have to fill all the fields correctly!')
    }
})

document.querySelector('#loginForm').addEventListener('submit', e => {
    
    e.preventDefault()

    let email = document.querySelector('#login_email').value
    let password = document.querySelector('#login_password').value

    let user = new User();
    user.email = email
    user.password = password
    user.login();

})