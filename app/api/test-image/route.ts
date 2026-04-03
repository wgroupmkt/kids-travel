import { generarImagen } from "@/lib/generarImagen";

export async function GET() {
  const buffer = await generarImagen("12345");

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}