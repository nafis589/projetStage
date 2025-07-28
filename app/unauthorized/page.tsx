"use client";

import Link from "next/link";
import { Ban } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Ban className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Accès refusé</h1>
        <p className="text-gray-700 mb-6">
          Vous n’avez pas la permission d’accéder à cette page.
        </p>
        <Link
          href="/"
          className="inline-block bg-black/70 hover:bg-black/80 text-white font-medium py-2 px-4 rounded transition"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
