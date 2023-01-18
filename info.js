function showInfo(car, totalTraffic, notDamaged, time = 0, carDensity) {
  //   const verticalButtons = document.getElementById("verticalButtons");
  const distanceTraveled = document.getElementById("distanceTraveled");
  distanceTraveled.innerHTML = "Y = " + car.y.toFixed();

  const speed = document.getElementById("speed");
  speed.innerHTML = "Speed= " + car.speed.toFixed();

  const traffic = document.getElementById("traffic");
  traffic.innerHTML = "Traffic= " + totalTraffic;

  const carsAlive = document.getElementById("carsAlive");
  carsAlive.innerHTML = "Alive= " + notDamaged;

  const timeElapsed = document.getElementById("timeElapsed");
  timeElapsed.innerHTML = `Time: ${(time / 1000).toFixed()} s`;

  const density = document.getElementById("density");
  density.innerHTML = `Density: ${carDensity.toFixed()}`;
}
