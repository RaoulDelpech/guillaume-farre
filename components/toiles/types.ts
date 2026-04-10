export interface PanelDimension {
  imageWidth: number;
  imageHeight: number;
}

export interface Toile {
  id: number;
  name: string;
  dimensions: string;
  technique: string;
  year: number;
  price: number;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  triptych?: boolean;
  images?: string[];
  panelDimensions?: PanelDimension[];
}

export interface ReservationForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}
