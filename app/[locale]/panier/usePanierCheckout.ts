"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/contexts/CartContext";
import { isEarlyAccess, EARLY_ACCESS_DISCOUNT } from "@/lib/early-access";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";

const KYC_THRESHOLD = 10_000;

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

type PaymentStatus = "loading" | "paid" | "pending" | null;

export function usePanierCheckout() {
  const { items, clearCart, totalPrice, daysUntilExpiration, engagementsAccepted, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [earlyAccess, setEarlyAccess] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    setEarlyAccess(isEarlyAccess());
  }, []);

  const discountAmount = earlyAccess ? totalPrice * EARLY_ACCESS_DISCOUNT : 0;
  const finalPrice = totalPrice - discountAmount;
  const needsKyc = finalPrice >= KYC_THRESHOLD;

  // Vérifier le statut du paiement après retour de Stripe
  useEffect(() => {
    if (success !== "true") return;

    const itemsForTracking = [...items];
    const totalForTracking = finalPrice;
    clearCart();

    if (!sessionId) {
      setPaymentStatus("paid");
      return;
    }

    setPaymentStatus("loading");
    fetch(`/api/stripe/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        const isPaid = data.payment_status === "paid";
        setPaymentStatus(isPaid ? "paid" : "pending");

        if (isPaid && itemsForTracking.length > 0) {
          trackPurchase(
            sessionId,
            itemsForTracking.map((item) => ({
              id: item.id,
              name: item.title,
              price: item.price,
              quantity: 1,
              category: item.category,
            })),
            totalForTracking
          );
        }
      })
      .catch(() => setPaymentStatus("paid"));
  }, [success, sessionId]);

  const handleVerifyIdentity = async () => {
    setVerifying(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe non disponible");

      const response = await fetch("/api/stripe/identity", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur de vérification");

      const { error: verifyError } = await stripe.verifyIdentity(data.clientSecret);
      if (verifyError) {
        if (verifyError.code === "session_cancelled") return;
        throw new Error(verifyError.message);
      }

      setIdentityVerified(true);
    } catch (err: unknown) {
      console.error("[Panier] Erreur vérification identité:", err);
      setError(err instanceof Error ? err.message : "Erreur lors de la vérification d'identité");
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (isEarlyAccess() && !engagementsAccepted) {
      router.push(`/${locale}/engagements`);
      return;
    }

    trackBeginCheckout(
      items.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: 1,
        category: item.category,
      })),
      finalPrice
    );

    setLoading(true);
    setError(null);

    try {
      const stripeItems = items.map((item) => ({
        title: item.title,
        price: item.price,
        category: item.category,
        images: [item.image],
        photoPath: item.photoPath,
        format: item.format || "A2",
        material: item.material || "semi-glossy",
        orientation: item.orientation || "vertical",
        frame: item.frame || "none",
      }));

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: stripeItems, locale }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("[Panier] Erreur API:", data);
        throw new Error(data.error || "Erreur lors de la création de la session de paiement");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (err: unknown) {
      console.error("[Panier] Erreur checkout:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    removeItem,
    clearCart,
    totalPrice,
    finalPrice,
    earlyAccess,
    discountAmount,
    needsKyc,
    identityVerified,
    loading,
    verifying,
    error,
    paymentStatus,
    daysUntilExpiration,
    engagementsAccepted,
    success,
    canceled,
    handleCheckout,
    handleVerifyIdentity,
  };
}
