"use client";

import { RotateCw, Sun, Contrast, Droplets, Palette, Move } from "lucide-react";
import type { PhotoEdits } from "./types";
import { defaultEdits, presets } from "./types";

interface EditSidebarProps {
  edits: PhotoEdits;
  onEditsChange: (edits: PhotoEdits) => void;
  onRotate: () => void;
  onFlip: (direction: "horizontal" | "vertical") => void;
  onSave?: (edits: PhotoEdits) => void;
}

export default function EditSidebar({ edits, onEditsChange, onRotate, onFlip, onSave }: EditSidebarProps) {
  const updateEdit = (key: keyof PhotoEdits, value: number) => {
    onEditsChange({ ...edits, [key]: value });
  };

  return (
    <div className="w-80 bg-gray-900 p-6 pt-24 overflow-y-auto">
      {/* Presets */}
      <div className="mb-6">
        <h4 className="text-white text-sm font-medium mb-3">Presets rapides</h4>
        <div className="grid grid-cols-2 gap-2">
          {presets.map(preset => (
            <button
              key={preset.name}
              onClick={() => onEditsChange(preset.edits)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                JSON.stringify(edits) === JSON.stringify(preset.edits)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ajustements */}
      <div className="space-y-4">
        <h4 className="text-white text-sm font-medium">Ajustements</h4>

        <SliderControl icon={<Sun className="w-4 h-4" />} label="Luminosité"
          value={edits.brightness} min={50} max={150} unit="%"
          onChange={(v) => updateEdit("brightness", v)} />

        <SliderControl icon={<Contrast className="w-4 h-4" />} label="Contraste"
          value={edits.contrast} min={50} max={150} unit="%"
          onChange={(v) => updateEdit("contrast", v)} />

        <SliderControl icon={<Palette className="w-4 h-4" />} label="Saturation"
          value={edits.saturation} min={0} max={200} unit="%"
          onChange={(v) => updateEdit("saturation", v)} />

        <SliderControl icon={<Droplets className="w-4 h-4" />} label="Flou"
          value={edits.blur} min={0} max={10} unit="px"
          onChange={(v) => updateEdit("blur", v)} />
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <button onClick={onRotate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">
          <RotateCw className="w-4 h-4" /> Rotation 90°
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onFlip("horizontal")}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
              edits.flip.horizontal ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}>
            <Move className="w-4 h-4 rotate-90" /> Flip H
          </button>
          <button onClick={() => onFlip("vertical")}
            className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
              edits.flip.vertical ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}>
            <Move className="w-4 h-4" /> Flip V
          </button>
        </div>

        <button onClick={() => onEditsChange(defaultEdits)}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
          title="Reset (Cmd+R)">
          Réinitialiser
        </button>

        {onSave && (
          <button onClick={() => onSave(edits)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
            Appliquer les modifications
          </button>
        )}
      </div>

      {/* Raccourcis */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        <h4 className="text-white text-sm font-medium mb-3">Raccourcis</h4>
        <div className="space-y-1 text-xs text-gray-400">
          <div>Espace : Comparer avec original</div>
          <div>G : Afficher/masquer grille</div>
          <div>1/2/3 : Modes de comparaison</div>
          <div>Cmd+R : Réinitialiser</div>
          <div>Échap : Fermer</div>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ icon, label, value, min, max, unit, onChange }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-gray-300 text-sm flex items-center gap-2">
          {icon} {label}
        </label>
        <span className="text-gray-400 text-xs">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

// Lalou
