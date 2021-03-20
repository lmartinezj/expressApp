
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

document.getElementById('captures-form').addEventListener('submit', async(event) => {
    event.preventDefault()
    const url = "/payments/" + document.getElementById('payment_id').value + "/captures";
    console.log("sent Capture request url: " + url);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
        document.open();
        document.write(data)
        document.close();
    })
    .catch(error => console.log("Error index.js: " + error.message))

});