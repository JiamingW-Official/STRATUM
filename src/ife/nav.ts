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
  /** The left drawer. Open over whatever screen you were on, never instead
      of it: half of what it carries are switches, not destinations. */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  /**
   * Which record the music screen is inside, or null for the shelf.
   *
   * It lived in the music screen's own state until the home rail started
   * carrying the four sleeves: pressing one has to arrive inside that record
   * rather than at the shelf with it somewhere on the page, and a screen
   * cannot be told that by a screen it has not mounted yet.
   */
  station: number | null;
  openStation: (i: number | null) => void;
};

export const useNav = create<Nav>((set) => ({
  filmId: null,
  openFilm: (filmId) => set({ filmId }),
  clear: () => set({ filmId: null }),
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  station: null,
  openStation: (station) => set({ station }),
}));
