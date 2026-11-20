export interface Angler {
  _id: string;
  user: string;
  name: string;
  sessions: unknown[]; // swap for a Session interface later
}