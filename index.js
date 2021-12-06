// Whenever the login page loads, check if they are already logged in or not
// If they are, simply check what their role is by sending an http request
// GET /checkloginstatus -> User object which has a userRole property
// If they are not logged in, continue to stay on the login page
window.addEventListener('load', async () => {

    console.log('EXECUTED');

    let res = await fetch('http://localhost:8080/checkloginstatus', {
        method: 'GET',
        credentials: 'include'
    });

    // If the above request results in a 200 status code, that means we are actually logged in
    // So we need to take the userRole information and determine where to redirect them to
    if (res.status === 200) {
        let userObj = await res.json();

        if (userObj.userRole === 'employee') {
            window.location.href = 'employee-homepage.html';
        } else if (userObj.userRole === 'finmanager') {
            window.location.href = 'finmanager-homepage.html';
        }
    }

});




/*
    Login functionality
*/
// We need to grab our button element
let loginButton = document.querySelector('#login-btn');

// After that, we need to specify what function we want to execute when the button is clicked
// So, we need to listen for the "click" event
// Add an event listener
loginButton.addEventListener('click', loginButtonClicked);

function loginButtonClicked() {
    login();
}

async function login() {
    let usernameInput = document.querySelector('#username');
    let passwordInput = document.querySelector('#password');

    try {
        let res = await fetch('http://localhost:8080/login', {
            method: 'POST',
            credentials: 'include', // This is to make sure that the browser retains the cookie and includes it in future requests
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            }) // JSON.stringify will take a JavaScript object and turn it into JSON
        });

        let data = await res.json();

        // Check if login is incorrect or not
        
        // if the status code is 400, data will represent an object
        // with the "message" property, which we can display
        if (res.status === 400) {
            let loginErrorMessage = document.createElement('p');
            let loginDiv = document.querySelector('#login-info');

            loginErrorMessage.innerHTML = data.message;
            loginErrorMessage.style.color = 'red';
            loginDiv.appendChild(loginErrorMessage);
        }

        // However, if the status code is 200, the data variable will represent an object
        // that corresponds with the User
        // We can go ahead and check what role the user has
        if (res.status === 200) {
            console.log(data.userRole);
            if (data.userRole === 'employee') {
                // redirect to employee homepage
                window.location.href = 'employee-homepage.html';
            } else if (data.userRole === 'finmanager') {
                window.location.href = 'finmanager-homepage.html';
            }
        }

    } catch(err) {
        console.log(err);
    }
    
}