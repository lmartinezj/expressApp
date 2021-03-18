var result;
console.log(document.cookie) 
document.getElementById('authorization-form').addEventListener('submit', async(event) => {
    event.preventDefault()
    const url = "/payments/" + document.getElementById('payment_id').value + "/authorizations";
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"payment_method":{"token":"7beb9f1a-6d22-40ca-81ae-c9f5d75808ee","type":"tokenized","credit_card_cvv":"123"},"reconciliation_id":"23434534534"});

    var authorizationRequest = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    }

    await fetch(url, paymentRequest)
    .then(response => {
        if (response.ok) {
            console.log("SUCCESS")
            return response.text()
        } else {
            console.log("FAILURE")
        }
    })
    .then(data => {
        document.write(data)
    })
    .catch(error => console.log("Error index.js: " + error.message))

});