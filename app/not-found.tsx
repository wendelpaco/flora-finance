"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 bg-gray-50">
      <h1 className="text-5xl font-bold text-emerald-600">404</h1>
      <p className="mt-4 text-xl font-semibold text-gray-800">
        Página não encontrada
      </p>
      <p className="mt-2 text-gray-500">
        A URL acessada não existe ou foi removida.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
