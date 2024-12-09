

export function generateRandomWord() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let word = "";
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      word += letters.charAt(randomIndex);
    }
    return word;
  }
  
  export function createFormAndAppendToDiv(document) {
    // Create a form element
    const form = document.createElement("form");
    form.id = "myForm";
  
    // Create a label element
    const label = document.createElement("label");
    label.htmlFor = "alphabets";
    label.textContent = "Enter code:";
  
    // Create an input element
    const input = document.createElement("input");
    input.type = "text";
    input.id = "alphabets";
    input.setAttribute("autocomplete", "off");
    input.oninput = function () {
      convertToUppercase(this);
      checkInput(this, 4);
    };
  
    // Create a button element
    const button = document.createElement("button");
    button.type = "button";
    button.id = "submitBtn";
    button.textContent = "Submit";
    button.disabled = true;
  
    // Append the label, input, and button to the form
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);
   
    // Find the div with the class 'start-div'
    const startDiv = document.querySelector(".start-div");
  
    // Append the form to the 'start-div'
    startDiv.appendChild(form);
  }


   function convertToUppercase(element) {
    element.value = element.value.toUpperCase();
  }
  
  
  function checkInput(element, maxLength) {
    // Remove any non-alphabetic characters
    element.value = element.value.replace(/[^A-Z]/g, "");
  
    // Truncate to the maximum length
    if (element.value.length > maxLength) {
      element.value = element.value.slice(0, maxLength);
    }
  
    // Enable or disable the button based on the input length
    var submitBtn = document.getElementById("submitBtn");
    if (element.value.length === maxLength) {
      submitBtn.disabled = false;
      const plywrd=element.value;
      submitBtn.style.backgroundColor = "green";
    } else {
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "gray";
    }
  }
  
  



 
  