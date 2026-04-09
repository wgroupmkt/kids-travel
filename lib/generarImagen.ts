import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// 🔥 primero registrar
registerFont(
  path.join(process.cwd(), "public/fonts/Inter.ttf"),
  { family: "Inter" }
);

export async function generarImagen(numero: string) {
  const imagePath = path.join(process.cwd(), "public/img/sorteo.jpg");
  const image = await loadImage(imagePath);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  // 🔥 usar la fuente registrada
  ctx.font = "bold 30px Inter";
  ctx.fillStyle = "#2d2a7b"; // azul del branding
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 4;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.textAlign = "left"; // importante
  ctx.fillText(numero, image.width * 0.63, image.height * 0.5677);

  return canvas.toBuffer("image/jpeg");
}