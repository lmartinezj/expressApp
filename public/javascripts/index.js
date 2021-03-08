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
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value
        } 
    }
    result = await POS.createToken(cardNumber, {
        additionalData,
        environment: 'test' // Set the PaymentOS environment you're connecting to
    })
    console.log("The response is: " + result)
});

document.getElementById('payment-form').addEventListener('submit', async(event) => {
    event.preventDefault()
    var json = JSON.parse(result)
    for (var key in json){
        console.log("key: " + key + " value: " + json[key])
    }
    result = createRequest()
    console.log("Payment response: " + result)
});

async function createRequest() {
    const url = 'payments';
    const data = {
        "amount": "25",
        "currency": "EUR",
        "statement_soft_descriptor": "Test Payment"
    };
    const idempotencyKey = "cust-" + Math.floor(Math.random() * 1000) + "-payment";

    
    const ohterParams = {
        "headers": {
            "Content-Type": "application/json",
            "api-version": "1.3.0",
            "x-payments-os-env": "test",
            "app-id": "co.Anthara.testbusinessunit",
            "private-key": "60055ba6-92ad-4a5a-8fec-e64e6d2d208c",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, private-key, idempotency-key, Authorization",
            "idempotency-key": idempotencyKey
        },
        "body": data,
        "method": "POST"
    };
    
    fetch(url, ohterParams)
    .then(datos =>{return datos.json()})
    .then(res => {console.log(res)})
    .catch(error => {console.log(error)})
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
