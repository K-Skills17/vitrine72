import type { ImageRef } from "@/types/image";

export interface Professional {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  bio: string;
  /** Placeholder registration, visibly marked as demonstration. */
  registration: string;
  image: ImageRef;
  /** Always true in the demo; drives the "fictício" label. */
  isFictional: true;
}
