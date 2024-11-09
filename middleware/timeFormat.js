function getTimeIn12HourFormat(date = new Date()) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';  
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'    
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
    const timeString = `${hours}:${minutesFormatted} ${ampm}`;
    return timeString;
  }
  console.log(getTimeIn12HourFormat()); // e.g., "10:35 AM"
  

  function timeStringTo24HourDate(timeString) {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);  
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set hours and minutes
    return date;
  }


  
  function getTimeDifference(startTime, endTime) {
    const startDate = timeStringTo24HourDate(startTime);
    const endDate = timeStringTo24HourDate(endTime);  
    const diffInMs = Math.abs(endDate - startDate);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;  
    return `${hours}H : ${minutes}M`;
  }
  

  
 module.exports = getTimeDifference
  // const startTime = '10:30 AM';
  // const endTime = '3:45 PM';
  // const { hours, minutes } = getTimeDifference(startTime, endTime)  
  // console.log(`Difference: ${hours}H:${minutes}M`); 
  