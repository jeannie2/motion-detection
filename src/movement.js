const hit1 = document.getElementById("hit1");
const hit2 = document.getElementById("hit2");
let leftHand = "";
let rightHand = "";

function random_rgba() {
  let o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
}

function setColors() {
  let boxShadow = "0 0 20px 30px white, "; // 0 0 20px 15px

  for (let i = 0; i < 5; i++) {
    const offsetX = 0;
    const offsetY = 30; //i % 2 === 0 ? -30 : 30;
    const blurRadius = 40 + 20 * i;
    const spreadRadius = 40; //20
    const color = random_rgba();
    boxShadow += `${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${color}, `;
  }

  return (boxShadow = boxShadow.slice(0, -2)); // remove trailing comma and space
}

export function moveCircles(touches, predictions, lastPredictions) {
  if (!touches.length) {
    const circles = document.querySelectorAll("circle");
    circles.forEach((circle) => {
      circle.style.visibility = "hidden";
    });
  } else if (touches.length === 1) {
    hit1.style.visibility = "visible";
    hit2.style.visibility = "hidden";
    // hit1.textContent = touches[0].x + " " + touches[0].y

    hit1.style.transform =
      "translate(" +
      touches[0].x * 0.003 +
      "vw, " +
      touches[0].y * 0.001 +
      "vh)";

    if (predictions.length >= 0 && !lastPredictions.length <= 0) {
      hit1.style.boxShadow = setColors();
    }
  } else if (touches.length === 2) {
    if (touches[0].x < touches[1].x) {
      leftHand = touches[0];
      rightHand = touches[1];
    } else if (touches[0].x > touches[1].x) {
      leftHand = touches[1];
      rightHand = touches[0];
    }

    hit1.style.visibility = "visible";
    hit2.style.visibility = "visible";

    // hit2.textContent = touches[1].x + " " + touches[1].y;

    // const windowHeight = window.innerHeight;
    // const y = (touches[0].y / windowHeight) * 100; // Convert touch position to percentage of window height

    // hit1.style.transform = `translate(0, ${y}vh)`;

    hit1.style.transform =
      "translate(" + leftHand.x * 0.003 + "vw, " + leftHand.y * 0.001 + "vh)";

    hit2.style.transform =
      "translate(" + rightHand.x * 0.003 + "vw, " + rightHand.y * 0.001 + "vh)";

    if (predictions.length >= 0 && !lastPredictions.length <= 0) {
      hit1.style.boxShadow = setColors();
      hit2.style.boxShadow = setColors();
    }
  }
}
