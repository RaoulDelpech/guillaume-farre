export interface PanelDimension {
  imageWidth: number;
  imageHeight: number;
}

export type ToileStatus =
  | 'available'
  | 'reserved_pending'
  | 'reserved_signed'
  | 'partial_paid'
  | 'paid'
  | 'unavailable';

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
  status?: ToileStatus;
  reservationId?: string | null;
  reservedUntil?: string | null;
}

export interface ReservationForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}
