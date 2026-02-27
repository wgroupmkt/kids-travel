import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔢 Generar número único
async function generateUniqueNumber() {
  let number = 0;
  let exists = true;

  while (exists) {
    number = Math.floor(1000 + Math.random() * 9000);

    const raffleRef = db.collection("raffleNumbers").doc(number.toString());
    const raffleDoc = await raffleRef.get();

    if (!raffleDoc.exists) {
      exists = false;

      await raffleRef.set({
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  return number;
}

export async function POST(req: Request) {
  try {
    const { sellerId, sellerName, name, dni, email, phone } =
      await req.json();

    if (!sellerId || !sellerName || !name || !dni) {
      return NextResponse.json({
        success: false,
        error: "Faltan datos obligatorios",
      });
    }

    const promoterRef = db.collection("promoters").doc(sellerId);
    const promoterDoc = await promoterRef.get();

    if (!promoterDoc.exists) {
      await promoterRef.set({
        name: sellerName,
        dni: sellerId,
        totalParticipants: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    const participantsSnapshot = await promoterRef
      .collection("participants")
      .get();

    if (participantsSnapshot.size >= 50) {
      return NextResponse.json({
        success: false,
        error: "Este promotor ya alcanzó el máximo de 50 participantes",
      });
    }

    const existingParticipant = await promoterRef
      .collection("participants")
      .where("dni", "==", dni)
      .get();

    if (!existingParticipant.empty) {
      return NextResponse.json({
        success: false,
        error: "Este DNI ya está registrado con este promotor",
      });
    }

    const raffleNumber = await generateUniqueNumber();

    await promoterRef.collection("participants").add({
      name,
      dni,
      email: email || "",
      phone: phone || "",
      raffleNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await promoterRef.update({
      totalParticipants: admin.firestore.FieldValue.increment(1),
    });

    // 📧 ENVIAR EMAIL
    if (email) {
      await resend.emails.send({
        from: "Sorteo <onboarding@resend.dev>",
        to: email,
        subject: "🎉 Confirmación de Registro - Sorteo",
        html: `
          <h2>Hola ${name} 👋</h2>
          <p>Tu registro fue exitoso.</p>
          <p><strong>Número de sorteo:</strong> ${raffleNumber}</p>
          <p>Promotor: ${sellerName}</p>
          <br/>
          <p>¡Mucha suerte! 🍀</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      raffleNumber,
    });

  } catch (error) {
    console.error("ERROR REGISTER:", error);

    return NextResponse.json({
      success: false,
      error: "Error en el servidor",
    });
  }
}