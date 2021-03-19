
console.log(document.cookie)

function getCookieByName(cookieName) {
    return document.cookie.split(';')
    .map( ( x ) => { 
    return x.trim()
    .split( '=' ); 
    })
    .reduce(( a, b ) => {
        a[ b[ 0 ] ] = b[ 1 ];
        return a;
    }, 
    {})[cookieName];
} 

console.log("token: " + getCookieByName("token"));
console.log("encrypted_cvv: " + getCookieByName("encrypted_cvv"));

document.getElementById('authorization-form').addEventListener('submit', async(event) => {
    event.preventDefault()
    const url = "/payments/" + document.getElementById('payment_id').value + "/authorizations";
    console.log("sent Auth request url: " + url);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "payment_method":{
            "token":getCookieByName("token"),
            "type":"tokenized",
            "credit_card_cvv":getCookieByName("encrypted_cvv")
        },
        "reconciliation_id":"23434534534"
    });

    var authorizationRequest = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    }

    await fetch(url, authorizationRequest)
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