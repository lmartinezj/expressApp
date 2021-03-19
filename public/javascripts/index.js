const style = {
    base: {
        color: '#fff',
        fontWeight: 600,
        fontFamily: 'Quicksand, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        
        ':focus': {
            color: '#424770'
        },

        '::placeholder': {
            color: '#9BACC8',
        },

        ':focus::placeholder': {
            color: '#CFD7DF',
        },

    },

    invalid: {
        color: 'FF0000',

        ':focus': {
            color: '#FA755A',
        },

        '::placeholder': {
            color: '#FFCCA5',
        },
    }
};

const fonts = [
    {
        src: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
    }
]
const formElements = new POS.Fields("798a672c-8719-47bc-b4a0-0f623f4a666f", {
    fonts
})

/*
The placeholders object is just one example of an additional option you can pass when 
instantiating a field.
*/

const placeholders = {        
    cardNumber: '1234 1234 1234 1234',
    expDate: 'MM / YY',
    cvv: '999' 
}  

// Instantiate the fields you want to show and mount them to the DOM.
const cardNumber = formElements.create('cardNumber', {
    style,
    placeholders
})
cardNumber.mount('#card-number')

const expiry = formElements.create('creditCardExpiry', {
    style,
    placeholders
})
expiry.mount('#exp-date')

const cvv = formElements.create('cvv', {
    style,
    placeholders
})
cvv.mount('#cvv')

//Create an event handler
var result;
document.getElementById('payment-form').addEventListener('createToken', async(event) => {
    
    event.preventDefault()
    const additionalData = {
        holder_name: document.getElementById('cardholder-name').value, // This field is mandatory
        billing_address:{
            line1: document.getElementById('line1').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value.toUpperCase(),
            phone: document.getElementById('phone').value
        } 
    }
    result = await POS.createToken(cardNumber, {
        additionalData,
        environment: 'test' // Set the PaymentOS environment you're connecting to
    })
    console.log("The response is: ")
    var json = JSON.parse(result)
    document.cookie = "token=" + json.token + "; secure"
    document.cookie = "encrypted_cvv=" + json.encrypted_cvv + "; secure"
    for (var key in json){
        console.log("key: " + key + " value: " + json[key])
    }
});

document.getElementById('payment-form').addEventListener('submit', async(event) => {
    event.preventDefault()
    const url = "/payments";
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = {
        "amount": 25,
        "currency":"EUR",
        "billing_address": {
            "line1":document.getElementById('line1').value,
            "city":document.getElementById('city').value,
            "country":document.getElementById('country').value.toUpperCase(),
            "phone":document.getElementById('phone').value
        },
        "statement_soft_descriptor": "Test Payment for PayU",
        "order": {
            "id":"myorderid"
        }
    };

    var paymentRequest = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
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

    /*
    try {
        const paymentRequest = await createPaymentRequest()
        const response = await fetch("/payments", paymentRequest)
        console.log("built paymentRequest: " + Object.entries(paymentRequest))
        console.log("Response from /payments is: " + console.log(response) )
    } catch(error) {
        console.log("Error: " + error.message)
    }

    
    try {
        const response = await fetch("/payments", paymentRequest)
        console.log("Response from /payments is: " + console.log(response) )
        return response
    } catch (error){
        console.log("Error from /payments is: " + error.message)
    }
    */

});

async function createPaymentRequest() {
    const url = '/payments';

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    var raw = {
        "amount":25,
        "currency":"EUR",
        "billing_address":JSON.parse(result)["billing_address"],
        "sastatement_soft_descriptor": "Test Payment for PayU",
        "order":{
            "id":"myorderid"
        }
    }
    
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    }

    return requestOptions
}

var cardReadyToSubmit = false;
var expiryReadyToSubmit = false;
var cvvReadyToSubmit = false;

cardNumber.on('change', (cardEvent) => {
    if ((cardEvent.complete) && (cardEvent.error == undefined)) {
        cardReadyToSubmit = true;
        console.log("cardReadyToSubmit")
        submitForm()
    }
})
        
expiry.on('change', (expiryEvent) => {
    if ((expiryEvent.complete) && (expiryEvent.error == undefined)) {
        expiryReadyToSubmit = true
        console.log("expiryReadyToSubmit")
        submitForm()
    }
})

cvv.on('change', (cvvEvent) => {
    if ((cvvEvent.complete) && (cvvEvent.error == undefined)) {
        cvvReadyToSubmit = true
        console.log("cvvReadyToSubmit")
        submitForm()
    }
});

async function submitForm() {
    console.log("run submitForm")
    if ((cardReadyToSubmit) && (expiryReadyToSubmit) && (cvvReadyToSubmit)) {
        console.log("ALL READY")
        //Fire the 'submit' event:
        document.getElementById('payment-form').dispatchEvent(new Event('createToken'))
    }
}
