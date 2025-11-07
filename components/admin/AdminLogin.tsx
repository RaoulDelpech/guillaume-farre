"use client";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        // Stocker le token dans sessionStorage
        sessionStorage.setItem("admin_token", data.token);
        onLogin();
      } else {
        setError("Mot de passe incorrect");
        setPassword("");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-light tracking-wide mb-2 text-center">
            Administration
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Guillaume Farré - Gestion des œuvres
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-light tracking-wide mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Entrez le mot de passe admin"
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-light tracking-wide rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Accès réservé à l'administrateur
          </p>
        </div>
      </div>
    </div>
  );
}

// Lalou
