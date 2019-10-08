let length = 12;
let timestamp = +new Date();

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function generate() {
  let ts = timestamp.toString();
  let parts = ts.split('').reverse();
  let id = '';

  for (let i = 0; i < length; ++i) {
    let index = getRandomInt(0, parts.length - 1);
    id += parts[index];
  }

  return id;
}
