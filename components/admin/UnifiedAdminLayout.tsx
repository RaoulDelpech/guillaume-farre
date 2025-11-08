"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminDashboard from "./AdminDashboard";
import PhotoManager from "./PhotoManager";
import AIAssistant from "./AIAssistant";
import PhotoPreview from "./PhotoPreview";
import { toast } from "sonner";

type TabType = "dashboard" | "photos" | "assistant" | "settings";

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action: () => void;
}

export default function UnifiedAdminLayout() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<any>(null);
  const [notifications, setNotifications] = useState<number>(3);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Sauvegarde automatique toutes les 30 secondes
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(() => {
      performAutoSave();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [autoSaveEnabled]);

  // Raccourcis clavier globaux
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd+K pour actions rapides
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowQuickActions(!showQuickActions);
      }

      // Cmd+1,2,3,4 pour navigation
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "1") setActiveTab("dashboard");
        if (e.key === "2") setActiveTab("photos");
        if (e.key === "3") setActiveTab("assistant");
        if (e.key === "4") setActiveTab("settings");
      }

      // Cmd+S pour sauvegarde manuelle
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        performAutoSave();
      }

      // Cmd+B pour toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showQuickActions, sidebarCollapsed]);

  const performAutoSave = () => {
    setLastSaved(new Date());
    toast.success("✅ Modifications sauvegardées automatiquement");
  };

  const quickActions: QuickAction[] = [
    {
      id: "upload",
      label: "Uploader photos",
      icon: "📸",
      shortcut: "Cmd+U",
      action: () => {
        setActiveTab("photos");
        toast.info("Mode upload activé");
      },
    },
    {
      id: "ai-generate",
      label: "Générer descriptions IA",
      icon: "🤖",
      shortcut: "Cmd+G",
      action: () => {
        setActiveTab("assistant");
        toast.info("Assistant IA ouvert");
      },
    },
    {
      id: "publish",
      label: "Publier sélection",
      icon: "🚀",
      shortcut: "Cmd+P",
      action: () => {
        toast.success("3 photos publiées avec succès");
      },
    },
    {
      id: "export",
      label: "Exporter données",
      icon: "📊",
      shortcut: "Cmd+E",
      action: () => {
        toast.info("Export en cours...");
      },
    },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊", badge: null },
    { id: "photos", label: "Photos", icon: "📸", badge: "186" },
    { id: "assistant", label: "IA Assistant", icon: "🤖", badge: notifications > 0 ? notifications.toString() : null },
    { id: "settings", label: "Paramètres", icon: "⚙️", badge: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 250 }}
        animate={{ width: sidebarCollapsed ? 70 : 250 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-white fixed left-0 top-0 h-full z-40"
      >
        {/* Logo et toggle */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold">Guillaume Farré</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-800 rounded transition-colors"
              title="Toggle sidebar (Cmd+B)"
            >
              {sidebarCollapsed ? "→" : "←"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left">{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">⌘{index + 1}</span>
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Actions rapides */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <button
              onClick={() => setShowQuickActions(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>Actions rapides</span>
              <span className="text-xs opacity-70">⌘K</span>
            </button>

            {/* Statut sauvegarde */}
            <div className="mt-4 text-center">
              {autoSaveEnabled && (
                <p className="text-xs text-gray-400">
                  Sauvegarde auto : {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.aside>

      {/* Contenu principal */}
      <main className={`flex-1 ${sidebarCollapsed ? "ml-[70px]" : "ml-[250px]"} transition-all`}>
        {/* Header avec breadcrumb et actions */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Admin</span>
              <span className="text-gray-400">/</span>
              <span className="font-semibold">
                {tabs.find(t => t.id === activeTab)?.label}
              </span>
            </div>

            {/* Actions header */}
            <div className="flex items-center gap-4">
              {/* Indicateur sauvegarde */}
              {autoSaveEnabled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-green-600"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"
                  />
                  <span>Sauvegarde auto activée</span>
                </motion.div>
              )}

              {/* Notifications */}
              {notifications > 0 && (
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-xl">🔔</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                </button>
              )}

              {/* Profil */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Guillaume</span>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu avec animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {activeTab === "dashboard" && <AdminDashboard />}
            {activeTab === "photos" && <PhotoManager />}
            {activeTab === "assistant" && <AIAssistant />}
            {activeTab === "settings" && <SettingsPanel />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modal Actions rapides (Cmd+K) */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickActions(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">⚡ Actions rapides</h2>
                <button
                  onClick={() => setShowQuickActions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.action();
                      setShowQuickActions(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium">{action.label}</p>
                      {action.shortcut && (
                        <p className="text-xs text-gray-500">{action.shortcut}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                Appuyez sur ESC pour fermer
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview photo modal */}
      {previewPhoto && (
        <PhotoPreview
          photo={previewPhoto}
          onSave={(edits) => {
            toast.success("Modifications appliquées");
            setPreviewPhoto(null);
          }}
          onCancel={() => setPreviewPhoto(null)}
        />
      )}

      {/* Floating Action Button mobile */}
      <button
        onClick={() => setShowQuickActions(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition-colors z-40"
      >
        ⚡
      </button>
    </div>
  );
}

// Panneau de paramètres
function SettingsPanel() {
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    darkMode: false,
    language: "fr",
    gelatoApiKey: "",
    stripeMode: "test",
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">⚙️ Paramètres</h2>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        {/* Paramètres généraux */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Général</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>Sauvegarde automatique</span>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="toggle"
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Notifications push</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="toggle"
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Mode sombre</span>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                className="toggle"
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Langue interface</span>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="it">Italiano</option>
              </select>
            </label>
          </div>
        </div>

        {/* Intégrations */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Intégrations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Gelato API Key
              </label>
              <input
                type="password"
                value={settings.gelatoApiKey}
                onChange={(e) => setSettings({ ...settings, gelatoApiKey: e.target.value })}
                placeholder="Entrer votre clé API Gelato"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <label className="flex items-center justify-between">
              <span>Mode Stripe</span>
              <select
                value={settings.stripeMode}
                onChange={(e) => setSettings({ ...settings, stripeMode: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="test">Test</option>
                <option value="live">Production</option>
              </select>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            💾 Sauvegarder
          </button>
          <button className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </button>
        </div>
      </div>

      {/* Raccourcis clavier */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">⌨️ Raccourcis clavier</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Actions rapides</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">⌘K</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sauvegarder</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">⌘S</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dashboard</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">⌘1</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Photos</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">⌘2</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Assistant IA</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">⌘3</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Toggle sidebar</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded">⌘B</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

// Lalou