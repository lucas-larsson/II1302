function containsNumber(inputString) {
    // \d matches any digit
    const regex = /\d/;
    return regex.test(inputString);
  }
  
  function containsSymbol(inputString) {
    // \W matches any non-word character (symbols and punctuation)
    const regex = /\W/;
    return regex.test(inputString);
  }

  function isValidEmail(email) {
    // Email validation regex
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  export {containsNumber, containsSymbol, isValidEmail}