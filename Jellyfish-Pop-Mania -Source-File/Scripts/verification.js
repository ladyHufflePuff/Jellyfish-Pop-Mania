class UserAuthenticator {
    constructor() {
        this.username = document.getElementById("username");
        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        this.password_confirmation = document.getElementById("password_confirmation");
        this.forgotPassword = document.getElementById("forgot_password_popup");
        this.users = JSON.parse(localStorage.getItem("users")) || []; // array to store user details
        
    }

    // method to indicate error and display error message
    setError(element, message) {
        const input_box = element.parentElement;
        const messageDisplay = input_box.querySelector('.error');
        messageDisplay.innerText = message;
        input_box.classList.add('error');
        input_box.classList.remove('success');
    }

    // method to indicate success
    setSuccess(element) {
        const input_box = element.parentElement;
        const messageDisplay = input_box.querySelector('.error');
        messageDisplay.innerText = '';
        input_box.classList.add('success');
        input_box.classList.remove('error');
    }

    // method to check if email is valid
    validEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // method to display login or registration status
    setStatus(message) {
        const messageDisplay = document.querySelector('.status');
        messageDisplay.innerText = message;
    }

    // method to redirect to preview page on successful login or registration
    redirect() {
        setTimeout(() => {
            window.location.href = 'preview.html';
        }, 4000);
    }

    // method to validate user input in on registration
    validateSignup() {
        let username_value = this.username.value.trim();
        let email_value = this.email.value.trim();
        let password_value = this.password.value.trim();
        let password_confirmation_value = this.password_confirmation.value.trim();

        if (username_value === '') {
            this.setError(this.username, "Username is required");
        } else if (this.users.some((user) => user.username === username_value)) {
            this.setError(this.username, "Username already exists");
        } else {
            this.setSuccess(this.username);
        }

        if (email_value === '') {
            this.setError(this.email, "Email address is required");
        } else if (!this.validEmail(email_value)) {
            this.setError(this.email, "Provide a valid email address");
        } else if (this.users.some((user) => user.email === email_value)) {
            this.setError(this.email, "Email address already exists");
        } else {
            this.setSuccess(this.email);
        }

        if (password_value === '') {
            this.setError(this.password, 'Password is required');
        } else if (password_value.length < 8) {
            this.setError(this.password, 'Password must be at least 8 characters.');
        } else {
            this.setSuccess(this.password);
        }

        if (password_confirmation_value === '') {
            this.setError(this.password_confirmation, 'Please confirm your password');
        } else if (password_confirmation_value !== password_value) {
            this.setError(this.password_confirmation, "Passwords don't match");
        } else {
            this.setSuccess(this.password_confirmation);
        }
    }

    // method to open popup
    openForgotPasswordPopup(){
        this.forgotPassword.style.display = "block";
    }

    // method to close popup
    closeForgotPasswordPopup(){
        this.forgotPassword.style.display = "none";
    }

    // method to validate user input on login
    validateSignin() {
        let username_value = this.username.value.trim();
        let password_value = this.password.value.trim();

        if (username_value === '') {
            this.setError(this.username, "Username is required");
        } else if (!this.users.some((user) => user.username === username_value)) {
            this.setError(this.username, "User not found");
        } else {
            this.setSuccess(this.username);
        }

        if (password_value === '') {
            this.setError(this.password, 'Password is required');
        } else {
            const user = this.users.find((user) => user.username === username_value);
            if (user && user.password === password_value) {
                this.setSuccess(this.password);
            } else {
                this.setError(this.password, 'Incorrect password');
            }
        }
    }
    
    // method to recover password and auto-fill password feild with recovered value
    recoverPassword() {
        if (
            this.username.parentElement.classList.contains('success')){
            const usernameValue = this.username.value.trim();
            const user = this.users.find(user => user.username === usernameValue);
    
            if (user) {
                this.password.value = user.password;
                userAuthenticator.closeForgotPasswordPopup();
            }
        }    
    }

  
}

const userAuthenticator = new UserAuthenticator();


document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup_form');
    const signinForm = document.getElementById('signin_form');
    const openForgotPassword = document.getElementById("open_forgot_password_popup")
    const closeForgotPassword = document.getElementById("close_forgot_password_popup")
    const passwordRecovery = document.getElementById("recover_password");
    // check if document loaded contains sign up form
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault(); // prevent auto form submission
            userAuthenticator.validateSignup();
        
            // check if form has been filled correctly
            if (
                userAuthenticator.username.parentElement.classList.contains('success') &&
                userAuthenticator.email.parentElement.classList.contains('success') &&
                userAuthenticator.password.parentElement.classList.contains('success') &&
                userAuthenticator.password_confirmation.parentElement.classList.contains('success')
            ) {
                // append user details to user array in local storage
                userAuthenticator.users.push({
                    "username": userAuthenticator.username.value.trim(),
                    "email": userAuthenticator.email.value.trim(),
                    "password": userAuthenticator.password.value.trim(),
                    "phone number": null,
                    "security answer": null,
                    "highscore": null,
                    "level": null
                    
                });
                localStorage.setItem("users", JSON.stringify(userAuthenticator.users));

                // set details of current user to local storage
                localStorage.setItem("username", JSON.stringify(userAuthenticator.username.value.trim()))
                localStorage.setItem("email", JSON.stringify( userAuthenticator.email.value.trim()))
                localStorage.setItem("password",JSON.stringify( userAuthenticator.password.value.trim()))
                localStorage.setItem("highscore",null)
                localStorage.setItem("phone number",null)
                localStorage.setItem("security answer",null)
                localStorage.setItem("music",true)
                localStorage.setItem("sound",true)
                userAuthenticator.setStatus("Your account has been created successfully!");
                userAuthenticator.redirect();
            }
        });
    }

    // check if document loaded contains sign in form
    if (signinForm) {
        signinForm.addEventListener('submit', function (e) {
            e.preventDefault(); // prevent auto form submission
            userAuthenticator.validateSignin();
        
            // check if form has been filled correctly
            if (
                userAuthenticator.username.parentElement.classList.contains('success') &&
                userAuthenticator.password.parentElement.classList.contains('success')
            ) {
                userAuthenticator.setStatus("Login successful!");
                
                // set details of current user to local storage
                let currentUser = userAuthenticator.users.find((user) =>{ return user.username  == userAuthenticator.username.value && user.password == userAuthenticator.password.value})
                if (currentUser){
                    localStorage.setItem("username", JSON.stringify(currentUser.username))
                    localStorage.setItem("email", JSON.stringify(currentUser.email))
                    localStorage.setItem("password",JSON.stringify( currentUser.password))
                    localStorage.setItem("highscore",JSON.stringify( currentUser.highscore))
                    localStorage.setItem("music",true)
                    localStorage.setItem("sound",true)
                }
                userAuthenticator.redirect();
            }
        });
    }

    // check if document loaded contains forgot password link
    if (openForgotPassword) {
        openForgotPassword.addEventListener('click', () => {
            userAuthenticator.openForgotPasswordPopup();
        });
    }
    if (closeForgotPassword) {
        closeForgotPassword.addEventListener('click', () => {
            userAuthenticator.closeForgotPasswordPopup();
        });
    }
    
    //call recover password method when recover password button is clicked
    if(passwordRecovery){
        passwordRecovery.addEventListener('click',  () => {
        userAuthenticator.recoverPassword();
        });
    }
    
});
