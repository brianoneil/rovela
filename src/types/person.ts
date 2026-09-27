export interface Person {
  id: string;
  name: string;
  /** Where or how the user met them. */
  context: string | null;
  /** Reference to a photo (media library asset id). */
  photoRef: string | null;
  createdAt: Date;
}
