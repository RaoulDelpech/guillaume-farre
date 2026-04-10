interface AdminSaveButtonProps {
  hasChanges: boolean;
  saving: boolean;
  onSave: () => void;
}

export default function AdminSaveButton({ hasChanges, saving, onSave }: AdminSaveButtonProps) {
  if (!hasChanges) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onSave}
        disabled={saving}
        className="px-8 py-4 bg-primary hover:bg-accent text-primary-foreground rounded-lg font-semibold text-lg shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {saving ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sauvegarde...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            Sauvegarder
          </>
        )}
      </button>
    </div>
  );
}
