const supportedCards = {
  visa, mastercard
};

const countries = [
  {
    code: "US",
    currency: "USD",
    currencyName: '',
    country: 'United States'
  },
  {
    code: "NG",
    currency: "NGN",
    currencyName: '',
    country: 'Nigeria'
  },
  {
    code: 'KE',
    currency: 'KES',
    currencyName: '',
    country: 'Kenya'
  },
  {
    code: 'UG',
    currency: 'UGX',
    currencyName: '',
    country: 'Uganda'
  },
  {
    code: 'RW',
    currency: 'RWF',
    currencyName: '',
    country: 'Rwanda'
  },
  {
    code: 'TZ',
    currency: 'TZS',
    currencyName: '',
    country: 'Tanzania'
  },
  {
    code: 'ZA',
    currency: 'ZAR',
    currencyName: '',
    country: 'South Africa'
  },
  {
    code: 'CM',
    currency: 'XAF',
    currencyName: '',
    country: 'Cameroon'
  },
  {
    code: 'GH',
    currency: 'GHS',
    currencyName: '',
    country: 'Ghana'
  }
];

const billHype = () => {
  const billDisplay = document.querySelector('.mdc-typography--headline4');
  if (!billDisplay) return;

  billDisplay.addEventListener('click', () => {
    const billSpan = document.querySelector("[data-bill]");
    if (billSpan &&
      appState.bill &&
      appState.billFormatted &&
      appState.billFormatted === billSpan.textContent) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(appState.billFormatted)
      );
    }
  });
};

const appState = {};

const formatAsMoney = (amount, buyerCountry) => {
const filteredCountry = countries.filter(item => item.country === buyerCountry)
console.log(filteredCountry);
if (filteredCountry[0].country === buyerCountry) {
return amount.toLocaleString(`en-${filteredCountry[0].code}`, {
  style: "currency",
  currency: filteredCountry[0].currency,
  currencyDisplay: "symbol"
})
} else {
return amount.toLocaleString(`en-${countries[0].code}`, {
  style: "currency",
  currency: countries[0].currency,
  currencyDisplay: "symbol"
})
}
};

const flagIfInvalid = (field, isValid) => {
isValid === true ? field.classList.remove('is-invalid') : field.classList.add('is-invalid');
}

const expiryDateFormatIsValid = (field) => {
const regEx = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
if (!regEx.test(field)) {
 return false;
}
 return true;
}

const detectCardType = (first4Digits) => {
let firstDigit = Number(first4Digits[0]);
const cardType = firstDigit === 4 ? "is-visa" : firstDigit === 5 ? "is-mastercard" : '';
const creditCard = document.querySelector('[data-credit-card');
const cardTypeElement = document.querySelector('[data-card-type]');
if (cardType === 'is-visa'){
  creditCard.classList.add('is-visa');
  creditCard.classList.remove('is-mastercard');
  cardTypeElement.src = supportedCards.visa;

} else if (cardType === 'is-mastercard'){
  creditCard.classList.add('is-mastercard');
  creditCard.classList.remove('is-visa');
  cardTypeElement.src = supportedCards.mastercard;
} else {
  creditCard.classList.remove('is-mastercard');
  creditCard.classList.remove('is-visa');
  cardTypeElement.src = "https://placehold.it/120x60.png?text=Card"
}
return cardType;
};

const validateCardExpiryDate = () => {
const dateInputs = document.querySelector('[data-cc-info]').children[1];
const validCard = expiryDateFormatIsValid(dateInputs.value);
const cardDate = dateInputs.value.split('/');
let month = cardDate[0];
if (month < 10) {
 month = `0${month}`
}
const year = cardDate[1];
const properDate = `01-${month}-20${year}`;
const today = new Date()
let dd = today.getDate();
let mm = today.getMonth() + 1;
const yyyy = today.getFullYear();
if (dd < 10) {
 dd = `0${dd}`
}
if (mm < 10) {
 mm = `0${mm}`
}
const presentDate = `${dd}-${mm}-${yyyy}`;
const now = new Date(presentDate);
const expiryDate = new Date(properDate);
if (now < expiryDate) {
flagIfInvalid(dateInputs, true)
return true;
}
 flagIfInvalid(dateInputs, false)
 return false;

};

const validateCardHolderName = () => {
const nameInputs = document.querySelector('[data-cc-info]').children[0];
const regEx = /^([a-zA-Z]{3,})\s([a-zA-Z]{3,})$/;
const validHolder = regEx.test(nameInputs.value);
flagIfInvalid(nameInputs, validHolder)
return validHolder;
};


const validateWithLuhn = (digits) => {
let value = digits.join('');
if (/[^0-9-\s]+/.test(value)) return false;

let nCheck = 0;
let nDigit = 0;
let bEven = 0;
value = value.replace(/\D/g, "");
for(let n = value.length - 1; n >= 0; n--){
let cDigit = value.charAt(n);
let nDigit = parseInt(cDigit, 10);
if(bEven) {
  if ((nDigit *= 2) > 9) nDigit -= 9;
}
nCheck += nDigit;
bEven = !bEven;
}
return (nCheck % 10) == 0;
}
const validateCardNumber = () => {
let digits = appState.cardDigits.flat();
const isValid = validateWithLuhn(digits);

const ccDigits = document.querySelector('[data-cc-digits]');
if (isValid) {
 ccDigits.classList.remove('is-invalid');
 return true;
} else {
 ccDigits.classList.add('is-invalid');
 return false;
}
}

const validatePayment = () => {
validateCardNumber();
validateCardHolderName();
validateCardExpiryDate();
}

const acceptCardNumbers = (event, fieldIndex) => {
}

const smartInput = (event, fieldIndex, fields) => {
const controlKeys = [
'Tab',
'Backspace',
'Delete',
'Shift',
'ArrowRight',
'ArrorLeft'
];

const isControlKey = controlKeys.includes(event.key)
if (!isControlKey) {
if (fieldIndex <= 3){
if (/^\d$/.test(event.key))	{
if (appState.cardDigits[fieldIndex] === undefined){
appState.cardDigits[fieldIndex] = [];
}
let field = fields[fieldIndex];
event.preventDefault();
const target = event.target;
let {selectionStart, value} = target;
appState.cardDigits[fieldIndex][selectionStart] = +event.key;
target.value = value.substr(0, selectionStart) + event.key + value.substr(selectionStart + 1);
setTimeout (() => {
console.log(appState.cardDigits)
appState.cardDigits[fieldIndex] = target.value.split('').map((car, i) => (car >= '0' && car <= '9') ? Number(car) : Number(appState.cardDigits[fieldIndex][i]));
if(fieldIndex < 3){
  target.value = target.value.replace(/\d/g, '$');
}
smartCursor(event, fieldIndex, fields);
if (fieldIndex == 0 && target.value.length >= 4){
  let first4Digits = appState.cardDigits[0];
  detectCardType(first4Digits);
}
}, 500)
} else {
event.preventDefault();
}
} else if (fieldIndex == 4) {
if (/[a-z]|\s/i.test(event.key)){
setTimeout(() => {
  smartCursor(event, fieldIndex, fields);
}, 500)
} else {
event.preventDefault();
}
} else {
if (/\d|\//.test(event.key)){
setTimeout(() => {
  smartCursor(event, fieldIndex, fields);
}, 500)
} else {
event.preventDefault();
}
}
} else {
if (event.key === 'Backspace'){
if(appState.cardDigits[fieldIndex].length > 0){
appState.cardDigits[fieldIndex].splice(-1, 1)
} else {}
smartBackSpace(event, fieldIndex, fields);
} else if (event.key == 'Delete'){
if (appState.cardDigits[fieldIndex].length > 0){
appState.cardDigits[fieldIndex].splice(1, 1)
}
}
}
}

const smartBackSpace = (event, fieldIndex, fields) => {
if(fields[fieldIndex].value === '' && fieldIndex > 0 && event.key === 'Backspace'){
fields[fieldIndex - 1].focus();
}
}

const smartCursor = (event, fieldIndex, fields) => {
  if (fields[fieldIndex].value.length >= fields[fieldIndex].size){
   fields[fieldIndex + 1].focus();
}
}

const enableSmartTyping = () => {
const inputFieldsA = document.querySelector('[data-cc-info]').children;
const inputFieldsB = document.querySelector('[data-cc-digits]').children;
const createArr1 = Array.from(inputFieldsA);
const createArr2 = Array.from(inputFieldsB);
const mergedArr = [...createArr2, ...createArr1];
mergedArr.forEach((field, index, fields) => {
field.addEventListener('keydown', (event) => {
  event.stopPropagation();
smartInput(event, index, fields);
})
})
}

const uiCanInteract = () => {
const speakBtn = document.querySelector('[data-pay-btn]');
const firstInput = document.querySelector('[data-cc-digits]').children[0];
firstInput.focus();
speakBtn.addEventListener('click', validatePayment());
billHype();
enableSmartTyping();
};

const displayCartTotal = ({results}) => {
const [data] = results;
const {itemsInCart, buyerCountry} = data;
appState.items = itemsInCart;
appState.country = buyerCountry;
appState.bill = itemsInCart.reduce((total, item) => {
return total + (item.price * item.qty);
}, 0);
appState.billFormatted = formatAsMoney(appState.bill, appState.country);
document.querySelector("[data-bill]").textContent = appState.billFormatted;
appState.cardDigits = [];
uiCanInteract();
};
const fetchBill = () => {
  const apiHost = 'https://randomapi.com/api';
const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
const apiEndpoint = `${apiHost}/${apiKey}`;
  fetch(apiEndpoint)
.then(response => response.json())
.then(data => displayCartTotal(data))
.catch(error => console.log(`err: ${error}`));
};

const startApp = () => {
fetchBill();
};

startApp();