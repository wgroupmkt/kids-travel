"use client";

import Script from "next/script";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "500"],
});

export default function Registro() {
  const [form, setForm] = useState({
    sellerId: "",
    name: "",
    dni: "",
    edad: "",
    email: "",
    phone: "",
    fechaNacimiento: "",
  });

  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ CALLBACK TURNSTILE
  useEffect(() => {
    (window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
      setErrorMessage("");
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // ✅ VALIDACIÓN CAPTCHA
    if (!turnstileToken) {
      setErrorMessage("Verificá que no sos un robot");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          turnstileToken,
        }),
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
          edad: "",
          fechaNacimiento: "",
          email: "",
          phone: "",
        });

        setTurnstileToken("");
      } else {
        setErrorMessage(data.error || "Ocurrió un error");
      }
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor");
    }

    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    let cleanValue = value;

    // ✅ SOLO NÚMEROS PARA DNI
    if (name === "dni" || name === "sellerId") {
      cleanValue = value.replace(/\D/g, "");
    }

    setForm({
      ...form,
      [name]: cleanValue,
    });
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/img/fondo.jpeg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full flex justify-center max-w-md bg-[#f5efdd]/80 backdrop-blur-2xl border border-[#e6dcc7] p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col gap-5"
      >
        {/* LOGO */}
        <div className="flex justify-end absolute top-8 right-7">
          <Image
            src="/img/logo.png"
            alt="Registro de Participante"
            width={370}
            height={100}
            className="object-contain w-[106px]"
          />
        </div>

        {/* TÍTULOS */}
        <div className="flex flex-col justify-start relative top-7 mt-5 ml-6 mb-5">
          <Image
            src="/img/registro.png"
            alt="Registro"
            width={250}
            height={120}
            className="object-contain"
          />

          <Image
            src="/img/participante.png"
            alt="Participante"
            width={150}
            height={120}
            className="object-contain"
          />
        </div>

        {/* PASAJERO */}
        <div className="flex flex-col gap-1 pl-5 pr-5">
          <h2
            className={`${montserrat.className} font-medium text-[#312783] ml-4 mb-0 text-xl`}
          >
            PASAJEROS
          </h2>

          <input
            name="sellerId"
            value={form.sellerId}
            onChange={handleChange}
            placeholder="DNI del pasajero"
            required
            maxLength={8}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]`}
          />
        </div>

        {/* PARTICIPANTE */}
        <div className="flex flex-col gap-1 pl-5 pr-5">
          <h2
            className={`${montserrat.className} font-medium text-[#312783] ml-4 mb-0 text-xl`}
          >
            PARTICIPANTES
          </h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className={`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]`}
          />

          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            placeholder="DNI del participante"
            required
            maxLength={8}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]`}
          />

           <input
              type={form.fechaNacimiento ? "date" : "text"}
              placeholder="Fecha de nacimiento"
              value={form.fechaNacimiento}
              onFocus={(e) => (e.target.type = "date")}
              onChange={handleChange}
              name="fechaNacimiento"
              className={`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]`}
            />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className={`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]`}
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            className={`${montserrat.className} font-light border-2 rounded-[200px] border-[#d8df6d] p-3 focus:ring-2 focus:ring-sky-400 outline-none text-[#312783]`}
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

        {/* TURNSTILE */}
        <div className="flex justify-center mt-2">
          <div
            className="cf-turnstile"
            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            data-callback="onTurnstileSuccess"
          />
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={loading}
          className="relative flex justify-center cursor-pointer group"
        >
          <Image
            src="/img/registrar.png"
            alt="Registrar"
            width={200}
            height={50}
            className="object-contain transition duration-300 ease-in-out hover:scale-105 hover:opacity-80"
          />
        </button>
      </form>

      {/* SCRIPT TURNSTILE */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
    </div>
  );
}