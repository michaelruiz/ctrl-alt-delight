"use client";

import React from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <main className="min-h-screen bg-red-900 text-white flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Oh no! Something went wrong. Please tell Michael ASAP so he can fix it!</h1>
          <p className="mb-4">{error?.message || "An unexpected error occurred."}</p>
          <button
            className="bg-white text-red-900 px-4 py-2 rounded font-bold hover:bg-red-200"
            onClick={() => reset()}
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
