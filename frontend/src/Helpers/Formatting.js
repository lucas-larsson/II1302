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
    const pad = (num) => ("0" + num).slice(-2);
    let formattedDate =
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) + // Months are zero-indexed in JavaScript
        "-" +
        pad(date.getDate()) +
        " " +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds()) +
        ".000000"; // Hard-coding microseconds to 0 because JS doesn't support them
    return formattedDate;
}


  export {containsNumber, containsSymbol, isValidEmail, formatDateFromData, formatDateToData}