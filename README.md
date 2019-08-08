# Smart-Pay-Card
A smart pay card built with vanilla javascript

**This project was inspired solely by Andela challenge 2.0**
<br/>

## Project Description

The aim was to build a smart pay card which detects card inputs and changes to VISA, MASTERCARD or remains PLAIN depending on user input.
<br/>

Credit card numbers were validated using the [luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm). 
<br/>

CSS classes were toggled to include and remove a line-through text decoration to give the user a valid/not-valid experience.
<br/>

Credit card numbers were masked with "**$**" 0.5 seconds after a user inputed a card digit to give the user a "your card details are secure from prying eyes" experience.
<br/>

Auto-tabbing was implemented, only appropraite characters were allowed at designated input fields (**e.g. only numbers could be inputted in credit card number fields, only letters could be inputted in the name field, only numbers and the symbol '/' could be inputted in the expiry date field just improve the user's experience.
<br/>

Users could delete, use their tab key, arrow keys and shift keys to move across input fields.
<br/> 

API calls were made from a random api endpoint and data was used to calculate a user's total bills and display on the DOM. 
<br/>

