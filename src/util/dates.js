export default function formatTimestamp(timestamp, type) {
  const date = new Date(timestamp)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'
  ];

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const year = date.getFullYear();
  const day = date.getDate();
  const month = months[date.getMonth()]
  const amPm = hours > 11 ? 'PM' : 'AM';
  let formattedHours = hours > 12 ? hours - 12 : hours;
  if (formattedHours === 0) {
    formattedHours = 12
  }
  
  if (type === "today") return `${formattedHours}:${minutes < 10 ? 0 : ''}${minutes}${amPm}`;
  if (type === "week" || type === "month") return `${month} ${day}`;
  if (type === "year") return `${month}`;
  if (type === "all") return `${year}`;

  return `${month} ${day}, ${year} ${formattedHours}:${minutes < 10 ? 0 : ''}${minutes}${amPm}`
}
