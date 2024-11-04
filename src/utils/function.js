export const getDateTime = (dt) => {
  const dT = dt.split(".")[0].split("T");
  return `${dT[0]} ${dT[1]}`;
};

export function generateRandomSixDigitNumber() {
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

export function formatDateToMMDDYYYY(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${year}`;
}

export function formatPhoneNumber(number) {
  // Ensure input is a string
  let numStr = typeof number === "number" ? number.toString() : number;

  // Check if the string has exactly 10 digits
  if (numStr?.length === 10) {
    // Format the number in (XXX) XXX-XXXX format
    return `(${numStr.slice(0, 3)}) ${numStr.slice(3, 6)}-${numStr.slice(6)}`;
  }

  // Return the original input if it's not a valid 10-digit number
  return numStr;
}

// Example usage:
console.log(formatPhoneNumber(1234567890)); // Output: (123) 456-7890

export function debounce(func, delay) {
  let timeoutId;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export function formatTime(time) {
  if (!time) {
    return "-";
  }
  let [timePart, period] = time?.split(" ");

  if (!period) {
    period = "AM";
  }

  let [hours, minutes] = timePart?.split(":");

  hours = hours?.padStart(2, "0");
  minutes = minutes?.padStart(2, "0");

  return `${hours}:${minutes} ${period}`;
}

// Example usage:
console.log(formatTime("10:0 AM")); // Output: 10:00 AM
console.log(formatTime("5:0 AM")); // Output: 05:00 AM

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
