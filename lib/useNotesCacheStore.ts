import { create } from "zustand";

type Tiles = Record<string, any>;
export const useNotesCacheStore = create<{
  tiles: Tiles;
  setTile: (key: string, value: any) => void;
  removeTile: (key: string) => void;
  clearCache: () => void;
  getTiles: (tileKeys?: string[]) => Tiles;
}>((set, getState) => ({
  tiles: {},
  setTile: (key, value) =>
    set((state) => ({ tiles: { ...state.tiles, [key]: value } })),
  removeTile: (key) =>
    set((state) => {
      delete state.tiles[key];
      return { tiles: state.tiles };
    }),
  clearCache: () => set({ tiles: {} }),
  getTiles: (tileKeys?: string[]) => {
    const currentTiles = getState().tiles;
    return (tileKeys || []).reduce((acc, key) => {
      if (currentTiles[key]) {
        acc[key] = currentTiles[key];
      }
      return acc;
    }, {});
  },
}));
