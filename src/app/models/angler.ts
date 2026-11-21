export interface Angler {
  _id: string;
  user: string;
  name: string;
  sessions: Session[];
}

export interface Catch {
  _id: string;
  species: string;
  quantity?: number;
  sizeCm?: number;
  bait?: string;
}

export interface Session {
  _id: string;
  location: {
    area: string;
    waterBody: string;
  };
  startTime: string;
  endTime?: string;
  catches: Catch[];
}

export interface SessionInput {
  location: { area: string; waterBody: string };
  startTime: string;
  endTime?: string;
}

export type CatchInput = Omit<Catch, '_id'>;
