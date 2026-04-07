"use client";

import { useState } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "500"], // 300 = Light, 500 = Medium
});

export default function Registro() {
  const [form, setForm] = useState({
    sellerId: "",
    name: "",
    dni: "",
    fechaNacimiento: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(
          `🎉 Registro exitoso! N° de sorteo: ${data.numeroSorteo}`
        );

        setForm({
          sellerId: "",
          name: "",
          dni: "",
          fechaNacimiento: "",
          email: "",
          phone: "",
        });
      } else {
        setErrorMessage(data.error || "Ocurrió un error");
      }
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor");
    }

    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
         <div
          className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/fondo.jpeg')" }}
        >

          

        <form onSubmit={handleSubmit}
       className="w-full flex justify-center max-w-md bg-[#f5efdd]/80 backdrop-blur-2xl border border-[#e6dcc7] p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col gap-5">

            <div className="flex justify-end absolute top-8 right-7">
               <Image
                 src="/img/logo.png"
                 alt="Registro de Participante"
                 width={370} height={100}
                 className="object-contain w-[106px] sm:w-[106px] md:w-[106px] lg:w-[106px]"
               />
             </div>


           <div className="flex flex-col justify-start relative top-7 mt-5 ml-6 mb-5">
        
        <Image
             src="/img/registro.png"
             alt="Registro de Participante"
             width={250}
             height={120}
             className="object-contain"
           />
       
          <Image
             src="/img/participante.png"
             alt="Registro de Participante"
             width={150}
             height={120}
             className="object-contain"
           />
           </div>


        {/* 🔵 PASAJERO */}
        <div className="flex flex-col gap-1 pl-5 pr-5">


          <h2 className="`${montserrat.className} font-medium  text-[#312783] ml-4 mb-0 text-xl">PROMOTORES</h2>

          <input
            name="sellerId"
            value={form.sellerId}
            onChange={handleChange}
            placeholder="D.N.I - Pasajero"
            required
            className="`${montserrat.className} font-light border-2 border-[#d8df6d] p-3 rounded-[200px] focus:ring-2 focus:ring-sky-400 outline-none text-[#1e40af]"
          />
        </div>

        {/* 🟢 PARTICIPANTE */}
        <div className="flex flex-col gap-1 pl-5 pr-5">
          <h2 className="`${montserrat.className} font-medium  text-[#312783] ml-4 mb-0 text-xl">PARTICIPANTES</h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]"
          />

          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="D.N.I - Participante"
            required
            className="`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]"
          />

          <input
            type="date"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            required
            className={`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]`}
           />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]/90"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            className="`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]"
          />
        </div>

        {/* MENSAJES */}
        {successMessage && (
          <div className="mx-auto bg-green-200 text-green-800 text-center p-3 rounded-lg text-sm font-medium w-full max-w-xs">
               {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-200 text-red-700 p-3 rounded-lg text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* BOTÓN */}
      <button className="relative flex justify-center cursor-pointer group">

         {/* Imagen normal */}
         <Image
           src="/img/registrar.png"
           alt="Registrar"
           width={200}
           height={50}
           className="object-contain transition duration-300 ease-in-out hover:scale-105 hover:opacity-80"
         />

       </button>
      </form>
    </div>
  );
}