const canvas = document.getElementById("myCanvas");
canvas.width = 500;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(
  road.getLaneCenter(Math.round(road.laneCount / 2) - 1),
  window.innerHeight * 0.7,
  canvas.width / 7,
  canvas.width / 4
);
car.draw(ctx);

animate();

function animate() {
  car.update(road.borders);

  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}
