const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  // Format the date to get day, month, year, and time components
  const hours = date.getHours() % 12 || 12; // Convert 24-hour time to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "pm" : "am";
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
  const year = date.getFullYear();

  // Return formatted string
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hours}:${minutes}${ampm}`;
};
export default formatDate;
