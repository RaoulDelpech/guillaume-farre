export interface PhotoEdits {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotation: number;
  flip: { horizontal: boolean; vertical: boolean };
}

export const defaultEdits: PhotoEdits = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  rotation: 0,
  flip: { horizontal: false, vertical: false }
};

export const presets = [
  { name: "Original", edits: defaultEdits },
  {
    name: "Noir & Blanc",
    edits: { ...defaultEdits, saturation: 0 }
  },
  {
    name: "Vintage",
    edits: { brightness: 110, contrast: 90, saturation: 70, blur: 0, rotation: 0, flip: { horizontal: false, vertical: false } }
  },
  {
    name: "Vibrant",
    edits: { brightness: 105, contrast: 110, saturation: 130, blur: 0, rotation: 0, flip: { horizontal: false, vertical: false } }
  },
  {
    name: "Dramatique",
    edits: { brightness: 90, contrast: 130, saturation: 110, blur: 0, rotation: 0, flip: { horizontal: false, vertical: false } }
  },
  {
    name: "Doux",
    edits: { brightness: 105, contrast: 95, saturation: 90, blur: 1, rotation: 0, flip: { horizontal: false, vertical: false } }
  }
];

// Lalou
