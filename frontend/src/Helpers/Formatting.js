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
  function formatDateFromData(date){

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC"
    });
  }
 
  function formatDateToData(date) {
    let formattedDate = date.toISOString().slice(0, 19).replace("T", " ") + ".000000";
    return formattedDate;
  }


  export {containsNumber, containsSymbol, isValidEmail, formatDateFromData, formatDateToData}