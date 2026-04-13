"use client";

import { useState } from "react";

type NotifyState = "idle" | "loading" | "success" | "error";

interface NotifyResult {
  sent: number;
  errors: number;
}

export default function NewsletterNotify() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [state, setState] = useState<NotifyState>("idle");
  const [result, setResult] = useState<NotifyResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    if (!window.confirm(`Envoyer la notification "${title}" à tous les abonnés ?`)) {
      return;
    }

    setState("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim() || undefined,
          linkUrl: "https://guillaumefarre.com/galerie",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setState("success");
        setResult({ sent: data.sent, errors: data.errors });
        setTitle("");
        setDescription("");
        setImageUrl("");
      } else {
        setState("error");
        setErrorMsg(data.error || "Erreur inconnue");
      }
    } catch {
      setState("error");
      setErrorMsg("Impossible de contacter le serveur.");
    }
  }

  return (
    <div className="border border-border rounded-lg p-6">
      <h2 className="text-xl font-light tracking-wide mb-4 text-foreground">
        Notification newsletter
      </h2>
      <p className="text-sm text-muted-foreground mb-6 font-light">
        Envoyer un email aux abonnés pour signaler une nouvelle œuvre.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="notify-title" className="block text-sm font-light text-foreground mb-1">
            Titre
          </label>
          <input
            id="notify-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nouvelle œuvre ajoutée"
            required
            className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background
              text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="notify-desc" className="block text-sm font-light text-foreground mb-1">
            Description
          </label>
          <textarea
            id="notify-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Courte description de la nouvelle œuvre..."
            required
            rows={3}
            className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background
              text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-y"
          />
        </div>

        <div>
          <label htmlFor="notify-img" className="block text-sm font-light text-foreground mb-1">
            URL image (optionnel)
          </label>
          <input
            id="notify-img"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://guillaumefarre.com/images/..."
            className="w-full px-3 py-2 text-sm border border-border rounded-sm bg-background
              text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={state === "loading" || !title.trim() || !description.trim()}
          className="min-h-[44px] px-6 py-2.5 text-sm font-light rounded-sm
            bg-[#1a1a1a] text-white hover:bg-[#333] transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Envoi en cours..." : "Notifier les abonnés"}
        </button>
      </form>

      {state === "success" && result && (
        <p className="mt-4 text-sm text-green-700 font-light">
          {result.sent} email{result.sent > 1 ? "s" : ""} envoyé{result.sent > 1 ? "s" : ""}
          {result.errors > 0 && `, ${result.errors} erreur${result.errors > 1 ? "s" : ""}`}.
        </p>
      )}

      {state === "error" && (
        <p className="mt-4 text-sm text-red-600 font-light">{errorMsg}</p>
      )}
    </div>
  );
}

// Lalou
