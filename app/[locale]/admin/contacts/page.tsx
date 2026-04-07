"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const subjectLabels: Record<string, string> = {
  oeuvre: "Acquisition d'une oeuvre",
  visite: "Visite de l'atelier",
  question: "Question",
  autre: "Autre",
};

/**
 * Page admin pour visualiser les messages de contact
 *
 * @author Lalou
 * @date 2025-01-20
 */
export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Erreur chargement contacts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, read: true } : c))
      );
    } catch (error) {
      console.error("Erreur marquage lu:", error);
    }
  }

  async function deleteContact(id: string) {
    if (!confirm("Supprimer ce message ?")) return;

    try {
      await fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  }

  const unreadCount = contacts.filter((c) => !c.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-2xl font-light">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <Link
              href="/fr/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
            >
              ← Retour à l'administration
            </Link>
            <h1 className="text-4xl font-light tracking-wide text-foreground">
              Messages de contact
            </h1>
            <p className="text-muted-foreground mt-2">
              {contacts.length} message{contacts.length !== 1 ? "s" : ""}
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-xs">
                  {unreadCount} non lu{unreadCount !== 1 ? "s" : ""}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={loadContacts}
            className="px-4 py-2 border border-border hover:border-foreground rounded transition-colors"
          >
            Actualiser
          </button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-5xl mb-6">📭</div>
            <p className="text-xl font-light">Aucun message pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liste des messages */}
            <div className="space-y-4">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (!contact.read) {
                      markAsRead(contact.id);
                    }
                  }}
                  className={`w-full text-left p-6 rounded-lg border transition-all ${
                    selectedContact?.id === contact.id
                      ? "border-primary bg-primary/5"
                      : contact.read
                      ? "border-border bg-card hover:border-foreground/30"
                      : "border-amber-500/50 bg-amber-500/5 hover:border-amber-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {!contact.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                      <span className="font-medium text-foreground">
                        {contact.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {contact.email}
                  </div>
                  <div className="text-xs inline-block px-2 py-1 bg-muted rounded mb-2">
                    {subjectLabels[contact.subject] || contact.subject}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {contact.message}
                  </p>
                </button>
              ))}
            </div>

            {/* Détail du message sélectionné */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              {selectedContact ? (
                <div className="bg-card border border-border rounded-lg p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-light text-foreground mb-1">
                        {selectedContact.name}
                      </h2>
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-primary hover:underline"
                      >
                        {selectedContact.email}
                      </a>
                    </div>
                    <button
                      onClick={() => deleteContact(selectedContact.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-6">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Sujet
                    </span>
                    <p className="text-foreground mt-1">
                      {subjectLabels[selectedContact.subject] ||
                        selectedContact.subject}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Date
                    </span>
                    <p className="text-foreground mt-1">
                      {new Date(selectedContact.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  <div className="mb-8">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Message
                    </span>
                    <p className="text-foreground mt-2 whitespace-pre-wrap leading-relaxed">
                      {selectedContact.message}
                    </p>
                  </div>

                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${
                      subjectLabels[selectedContact.subject] ||
                      selectedContact.subject
                    }`}
                    className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors"
                  >
                    Répondre par email
                  </a>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="text-4xl mb-4 text-muted-foreground/30">
                    📧
                  </div>
                  <p className="text-muted-foreground font-light">
                    Sélectionne un message pour voir les détails
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
