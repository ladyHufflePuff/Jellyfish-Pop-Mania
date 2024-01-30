// retreiving user data and displaying it in profile section
const usernameElement = document.getElementById("username");
const username = JSON.parse(localStorage.getItem("username"));
usernameElement.innerHTML = username;
const emailElement = document.getElementById("email");
const email =  JSON.parse(localStorage.getItem("email"));
emailElement.innerHTML = email
const passwordElement = document.getElementById("password");
const password = JSON.parse(localStorage.getItem("password"));
passwordElement.innerHTML = password
let phoneNumberElement = document.getElementById("phone_number");
let phoneNumber = JSON.parse(localStorage.getItem("phone number"));
let securityQuestionElement = document.getElementById("security_question");
let securityQuestion = JSON.parse(localStorage.getItem("security answer"));
if (phoneNumber) {
    const openPhone = document.getElementById("open_phone_popup");
    phoneNumberElement.innerHTML = phoneNumber;
    openPhone.innerHTML = "Change Phone number";
}
if (securityQuestion) {
    const openSecurity = document.getElementById("open_security_popup");
    securityQuestionElement.innerHTML = securityQuestion;
    openSecurity.innerHTML = "Change Security question";
}
    


const logoutPopup = document.getElementById("logout_popup");
const deletePopup = document.getElementById("delete_popup");
const phonePopup = document.getElementById("phone_popup");
const securityPopup = document.getElementById("security_popup");
const openLogout = document.getElementById("open_logout_popup");
const closeLogout = document.getElementById("close_logout_popup");
const openDelete = document.getElementById("open_delete_popup");
const closeDelete = document.getElementById("close_delete_popup");
const openPhone = document.getElementById("open_phone_popup");
const closePhone = document.getElementById("close_phone_popup");
const openSecurity = document.getElementById("open_security_popup");
const closeSecurity = document.getElementById("close_security_popup");
const deleteAccount = document.getElementById("terminate");

// function to open  popup
function openPopup(action) {
        action.style.display = "block";
    }
   
 // method to close  popup
function closePopup(action) {
        action.style.display = "none";
    }

// Event listeners
openLogout.addEventListener("click", () =>{
    openPopup(logoutPopup);
});
closeLogout.addEventListener("click", () =>{
   closePopup(logoutPopup);
});
openDelete.addEventListener("click", () =>{
   openPopup(deletePopup);

});
closeDelete.addEventListener("click", () =>{
    closePopup(deletePopup);
});
openPhone.addEventListener("click", () =>{
    openPopup(phonePopup);
});
closePhone.addEventListener("click", () =>{
    closePopup(phonePopup);
});
openSecurity.addEventListener("click", () =>{
    openPopup(securityPopup);
});
closeSecurity.addEventListener("click", () =>{
    closePopup(securityPopup);
});
deleteAccount.addEventListener("click", () =>{
    closePopup(deletePopup);
});

let phoneNumberValue = document.getElementById("phone_number_entry");
let securityQuestionValue = document.getElementById("security_question_entry");
let setPhoneNumber = document.getElementById("save_phone_number");
let setSecurityQuestion = document.getElementById("save_security_question");
let users = JSON.parse(localStorage.getItem("users")) ||[]
const userIndex = users.findIndex(user => user.username === username);

//validating and storing entered phone number to HTML local storage
setPhoneNumber.addEventListener("click", () => {
  const value = phoneNumberValue.value;
  const phoneNumberPattern = /^\d{8}$/;
  let errorMessage = document.getElementById("phone_number_error");
  if (!value.trim() || !phoneNumberPattern.test(value)) {
    errorMessage.innerHTML = "Please enter a valid 8- digit phone number.";
    return;
    }else{
        errorMessage.innerHTML = "Phone number added successfully !"
        errorMessage.style.color = "#09c372";
    }
  localStorage.setItem("phone number", JSON.stringify(value));
  if (userIndex !== -1) {
    users[userIndex]["phone number"] = value;
    localStorage.setItem("users", JSON.stringify(users));
    phoneNumberElement.innerHTML = value;
    openPhone.innerHTML = "Change Phone number";
  }
});
  
//validating and storing entered security question answer to HTML local storage
setSecurityQuestion.addEventListener("click", () => {
  const value = securityQuestionValue.value;
  let errorMessage = document.getElementById("security_question_error");
  if (!value.trim() ){
    errorMessage.innerHTML = "Please enter a security answer.";
    return;
    }else{
        errorMessage.innerHTML = "Security answer added successfully !";
        errorMessage.style.color = "#09c372";
    }
  localStorage.setItem("security answer", JSON.stringify(value));
  if (userIndex !== -1) {
    users[userIndex]["security answer"] =value;
    localStorage.setItem("users", JSON.stringify(users));
    securityQuestionElement.innerHTML = value;
    openSecurity.innerHTML = "Change Security question";

  }
});

// deleting account of current user from users array in HTML local storage
deleteAccount.addEventListener("click", () =>{
    if (userIndex !== -1) {
        users.splice(userIndex, 1);}
         localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "landing.html";    
});

// retreiving music and sound html elements and their state from HTML local storage
const music = document.getElementById("toggle_music");
const sound = document.getElementById("toggle_sound");
const SoundEnabled =  JSON.parse(localStorage.getItem("sound"));
const MusicEnabled =  JSON.parse(localStorage.getItem("music"));
sound.checked = SoundEnabled !== null ? SoundEnabled : true;
music.checked = MusicEnabled !== null ? MusicEnabled : true;

// function to change sound state
function toggleSound(){
    const state = sound.checked;
    localStorage.setItem("sound", JSON.stringify(state));
}

//function to change music state
function toggleMusic(){
    const state = music.checked;
    localStorage.setItem("music", JSON.stringify(state));
}

// event listener
sound.addEventListener("change", toggleSound);
music.addEventListener("change", toggleMusic);


