"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Page de login simple - juste un mot de passe
 * @author Lalou
 * @date 2025-11-30
 */
export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/fr");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-wide text-white mb-2">
            Guillaume Farré
          </h1>
          <p className="text-white/50 font-light text-sm">
            Accès au site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded text-white placeholder-white/40 font-light focus:outline-none focus:border-white/50 transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-light text-center">
              Mot de passe incorrect
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 bg-white text-black font-light tracking-wide rounded hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Entrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
