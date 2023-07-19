const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const partical = [];
const img = new Image();
img.src = "./logo.png";
const particalDiameter = 2;
img.addEventListener("load", () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
  const numRows = Math.round(img.height / particalDiameter);
  const numColums = Math.round(img.width / particalDiameter);

  for (let row = 0; row < numRows; row++) {
    for (let column = 0; column < numColums; column++) {
      const pixelIndex =
        (row * particalDiameter * img.width + column * particalDiameter) * 4;

      const red = imgData[pixelIndex];
      const green = imgData[pixelIndex + 1];
      const blue = imgData[pixelIndex + 2];
      const alpha = imgData[pixelIndex + 3];
      partical.push({
        x: Math.floor(Math.random() * numColums * particalDiameter),
        // x: column * particalDiameter + particalDiameter / 2,
        y: Math.floor(Math.random() * numRows * particalDiameter),
        // y: row * particalDiameter + particalDiameter / 2,
        originX: column * particalDiameter + particalDiameter / 2,
        originY: row * particalDiameter + particalDiameter / 2,
        color: `rgba(${red}, ${green},${blue},${alpha / 255})`,
      });
    }
  }
  drawParticles();
});

function drawParticles() {
  updateParticales();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  partical.forEach((par) => {
    ctx.beginPath();
    ctx.arc(par.x, par.y, particalDiameter / 2, 0, 2 * Math.PI);
    ctx.fillStyle = par.color;
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

let mouseX = Infinity;
let mouseY = Infinity;
canvas.addEventListener("mousemove", (event) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

canvas.addEventListener("mouseleave", () => {
  mouseX = Infinity;
  mouseY = Infinity;
});

function updateParticales() {
  const repelRadius = 30;
  const repelSpeed = 5;
  const returnSpeed = 0.1;
  partical.forEach((par) => {
    const distanceFromMouseX = mouseX - par.x;
    const distanceFromMouseY = mouseY - par.y;
    const distanceFromMouse = Math.sqrt(
      distanceFromMouseX ** 2 + distanceFromMouseY ** 2
    );
    if (distanceFromMouse < repelRadius) {
      const angle = Math.atan2(distanceFromMouseY, distanceFromMouseX);
      const force = (repelRadius - distanceFromMouse) / repelRadius;
      const moveX = Math.cos(angle) * force * repelSpeed;
      const moveY = Math.sin(angle) * force * repelSpeed;
      par.x -= moveX;
      par.y -= moveY;
    } else if (par.x !== par.originX || par.y !== par.originY) {
      const distanceFromOriginX = par.originX - par.x;
      const distanceFromOriginY = par.originY - par.y;
      const distanceFromOrigin = Math.sqrt(
        distanceFromOriginX ** 2 + distanceFromOriginY ** 2
      );
      const angle = Math.atan2(distanceFromOriginY, distanceFromOriginX);
      const moveX = Math.cos(angle) * distanceFromOrigin * returnSpeed;
      const moveY = Math.sin(angle) * distanceFromOrigin * returnSpeed;
      par.x += moveX;
      par.y += moveY;
    }
  });
}
