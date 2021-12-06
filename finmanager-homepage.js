// Check to see if the user is logged in or not, and if not, relocate them back to
// login screen
window.addEventListener('load', async () => {

    let res = await fetch('http://localhost:8080/checkloginstatus', {
        credentials: 'include',
        method: 'GET'
    });

  
     if (res.status === 401) {
        window.location.href = 'index.html';
    }

    // If we make it past the authorization checks, call another function that will 
    // retrieve all reimtickets
    populateTableWithReimtickets();

});

async function populateTableWithReimtickets() {
    let res = await fetch('http://localhost:8080/reimtickets', {
        credentials: 'include',
        method: 'GET'
    });

    let tbodyElement = document.querySelector("#reimticket-table tbody");
    tbodyElement.innerHTML = '';

    let reimticketArray =  await res.json();

    for (let i = 0; i < reimticketArray.length; i++) {
        let reimticket = reimticketArray[i];

        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = reimticket.id;

        let td2 = document.createElement('td');
        td2.innerHTML = reimticket.reimticketType;

        let td3 = document.createElement('td'); // amount
        let td4 = document.createElement('td'); // resolver id

        // If the reimticket has already been approved, display the reimamount and resolverId
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');
        if (reimticket.resolverId != 0) {
            td3.innerHTML = reimticket.reimamount;
            td4.innerHTML = reimticket.resolverId;
        } else { // otherwise, display the below content
            td3.innerHTML = 'Pending';
            td4.innerHTML = '-';

            // Main challenge here is linking each button with a particular parameter
            // (reimticket id that we want to change the grade of)
            let reimamountInput = document.createElement('input');
            reimamountInput.setAttribute('type', 'number');

            let approveButton = document.createElement('button');
            approveButton.innerText = 'Approve';
            approveButton.addEventListener('click', async () => {
               
                let res = await fetch(`http://localhost:8080/reimtickets/${reimticket.id}/reimamount`, 
                    {
                        credentials: 'include',
                        method: 'PATCH',
                        body: JSON.stringify({
                            reimamount: reimamountInput.value
                        })
                    });

                if (res.status === 200) {
                    populateTableWithReimtickets(); // Calling the function to repopulate the entire
                    // table again
                }
            });

            td6.appendChild(approveButton);
            td7.appendChild(reimamountInput);
        }
 

        let td5 = document.createElement('td');
        td5.innerHTML = reimticket.reimticketId;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);

        tbodyElement.appendChild(tr);
    }
}


let logoutBtn = document.querySelector('#logout');

logoutBtn.addEventListener('click', async () => {

    let res = await fetch('http://localhost:8080/logout', {
        'method': 'POST',
        'credentials': 'include'
    });

    if (res.status === 200) {
        window.location.href = 'index.html';
    }

})