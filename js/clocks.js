var secondHand = document.querySelectorAll('.second-hand');
var minsHand = document.querySelectorAll('.min-hand');
var hourHand = document.querySelectorAll('.hour-hand');

function transformHand(city, offset) {

  var seconds = city.getSeconds();
  var secondsDegrees = ((seconds / 60) * 360) + 90;
  secondHand[offset].style.transform = `rotate(${secondsDegrees}deg)`;

  var mins = city.getMinutes();
  var minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
  minsHand[offset].style.transform = `rotate(${minsDegrees}deg)`;

  var hour = city.getHours();
  var hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
  hourHand[offset].style.transform = `rotate(${hourDegrees}deg)`;
}

function setDate() {
  
  //current location date
  const now = new Date();

  //convert to UTC milliseconds
  var utc = now.getTime() + (now.getTimezoneOffset() * 60000); 

  //get timezones
  var toronto = new Date(utc + (3600000* -4));
  var tokyo = new Date(utc + (3600000* 9));
  var singapore = new Date(utc + (3600000* 8));

  transformHand(toronto, 0);
  transformHand(tokyo, 1);
  transformHand(singapore, 2);
}

setInterval(setDate, 1000);

setDate();