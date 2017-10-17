const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

const secondHand2 = document.querySelector('.second-hand2');
const minsHand2 = document.querySelector('.min-hand2');
const hourHand2 = document.querySelector('.hour-hand2');

const secondHand3 = document.querySelector('.second-hand3');
const minsHand3 = document.querySelector('.min-hand3');
const hourHand3 = document.querySelector('.hour-hand3');

function setDate() {
  const now = new Date();

  const seconds = now.getSeconds();
  const secondsDegrees = ((seconds / 60) * 360) + 90;
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  secondHand2.style.transform = `rotate(${secondsDegrees}deg)`;
  secondHand3.style.transform = `rotate(${secondsDegrees}deg)`;

  const mins = now.getMinutes();
  const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
  minsHand.style.transform = `rotate(${minsDegrees}deg)`;
  minsHand2.style.transform = `rotate(${minsDegrees}deg)`;
  minsHand3.style.transform = `rotate(${minsDegrees}deg)`;

  const hour = now.getHours();
  const hour2 = now.getHours() +1;
  const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
  const hourDegrees2 = ((hour2 / 12) * 360) + ((mins/60)*30) + 90;
  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
  hourHand2.style.transform = `rotate(${hourDegrees2}deg)`;
  hourHand3.style.transform = `rotate(${hourDegrees}deg)`;
}

setInterval(setDate, 1000);

setDate();