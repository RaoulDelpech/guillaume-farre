"use client";

import { useState, useRef, useEffect } from "react";
import { useAdminMode } from "@/contexts/AdminModeContext";

interface EditableTextProps {
  /** Clé unique pour identifier le texte (ex: "home.hero.title") */
  textKey: string;
  /** Valeur actuelle du texte */
  children: string;
  /** Tag HTML à utiliser (h1, h2, p, span, etc.) */
  as?: keyof JSX.IntrinsicElements;
  /** Classes CSS */
  className?: string;
  /** Multiline (textarea) ou single line (input) */
  multiline?: boolean;
}

/**
 * Composant texte éditable en mode admin
 * En mode normal : affiche le texte
 * En mode admin : permet l'édition inline
 *
 * @author Lalou
 * @date 2025-11-30
 */
export default function EditableText({
  textKey,
  children,
  as: Tag = "span",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { isAdminMode, pendingChanges, setPendingChange } = useAdminMode();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(children);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Valeur à afficher : pending > local > original
  const displayValue = pendingChanges.get(textKey) ?? localValue;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Mode lecture normal
  if (!isAdminMode) {
    return <Tag className={className}>{children}</Tag>;
  }

  // Mode admin - édition
  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: displayValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalValue(e.target.value);
        setPendingChange(textKey, e.target.value);
      },
      onBlur: () => setIsEditing(false),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsEditing(false);
        }
        if (e.key === "Enter" && !multiline) {
          setIsEditing(false);
        }
      },
      className: `${className} bg-yellow-50 border-2 border-yellow-400 rounded px-2 py-1 outline-none w-full`,
      style: { minWidth: "100px" },
    };

    if (multiline) {
      return (
        <textarea
          {...commonProps}
          rows={Math.max(3, displayValue.split("\n").length)}
        />
      );
    }

    return <input type="text" {...commonProps} />;
  }

  // Mode admin - affichage avec indicateur éditable
  const hasChanges = pendingChanges.has(textKey);

  return (
    <Tag
      className={`${className} cursor-pointer hover:bg-yellow-100 hover:outline hover:outline-2 hover:outline-yellow-400 hover:outline-dashed rounded transition-all ${
        hasChanges ? "bg-yellow-50 outline outline-2 outline-yellow-500" : ""
      }`}
      onClick={() => setIsEditing(true)}
      title={`Cliquer pour modifier (${textKey})`}
    >
      {displayValue}
      {hasChanges && (
        <span className="ml-1 text-xs text-yellow-600 font-normal">*</span>
      )}
    </Tag>
  );
}
