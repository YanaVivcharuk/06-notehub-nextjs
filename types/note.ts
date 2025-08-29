export interface Note {
  id: number | string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface NewNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}
