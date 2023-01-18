const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 700;

const carWdh = carCanvas.width / 5;
const CarHgt = carCanvas.width / 3;
const carYStart = window.innerHeight * 0.7;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);

const mainMaxSpeed = 50;
const N = 500;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    i === 0 && console.log("best saved brain: ", cars[i].brain);
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

let totalTraffic = 0;
function generateTraffic() {
  totalTraffic += 1;
  let lane = Math.round(Math.random() * 2);
  let Ypos = bestCar.y - 1400;

  traffic.push(
    new Car(road.getLaneCenter(lane), Ypos, carWdh, CarHgt, "DUMMY", 5)
  );
}

const traffic = [
  // new Car(road.getLaneCenter(0), carYStart / 3, carWdh, CarHgt, "DUMMY", 5),
  // new Car(road.getLaneCenter(1), carYStart / 1.8, carWdh, CarHgt, "DUMMY", 5),
  // new Car(road.getLaneCenter(2), carYStart / 4, carWdh, CarHgt, "DUMMY", 5),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
  console.log("bestCar", bestCar);
  console.log("bestCar speed=", bestCar.speed);
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(
      new Car(
        road.getLaneCenter(1),
        carYStart,
        carWdh,
        CarHgt,
        "AI",
        mainMaxSpeed
      )
    );
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  // fitness function
  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  let density = ((1 / mainMaxSpeed) * 2000) / (1 / 12);
  if (time > totalTraffic * density) generateTraffic(time);

  showInfo(
    bestCar,
    totalTraffic,
    cars.filter((car) => !car.damaged).length,
    time,
    density
  );

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
