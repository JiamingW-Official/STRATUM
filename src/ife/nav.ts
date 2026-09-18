import { create } from "zustand";

/**
 * Where a card wants a screen to open, when "the screen" is not enough.
 *
 * The home rail carries a film, and pressing it should land on that film's
 * page rather than on the shelf with the film somewhere in it. The screen name
 * cannot say which film, and the film is not part of the seat's state until it
 * is playing, so the intent lives here: one field, cleared by whoever acts on
 * it.
 */
type Nav = {
  filmId: string | null;
  openFilm: (id: string) => void;
  clear: () => void;
};

export const useNav = create<Nav>((set) => ({
  filmId: null,
  openFilm: (filmId) => set({ filmId }),
  clear: () => set({ filmId: null }),
}));
