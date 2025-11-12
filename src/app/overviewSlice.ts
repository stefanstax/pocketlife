import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface OpenPanelProps {
  name: string;
  panelId: string | null;
  data: any;
  transactionOverview: boolean;
}

interface ClosePanelProps {
  panelId: string;
}

const initialState: OpenPanelProps = {
  name: "",
  panelId: null,
  data: null,
  transactionOverview: false,
};

const overviewSlice = createSlice({
  name: "overviewSlice",
  initialState,
  reducers: {
    openOverview: (state, action: PayloadAction<OpenPanelProps>) => {
      if (action.payload.name === "transactionPanel") {
        state.name = action.payload.name;
        state.transactionOverview = true; // always true
        state.data = action.payload.data;
        state.panelId = action.payload.panelId;
      }
    },
    closeOverview: (state, action: PayloadAction<ClosePanelProps>) => {
      if (state.panelId === action.payload.panelId) {
        state.transactionOverview = false;
        state.panelId = null;
        state.data = null;
        state.name = "";
      }
    },
    closeAllOverviews: (state) => {
      state.data = null;
      state.name = "";
      state.panelId = null;
      state.transactionOverview = false;
    },
  },
});

export const { openOverview, closeOverview, closeAllOverviews } =
  overviewSlice.actions;
export const transactionPanelData = (state: RootState) => state.overview;
export default overviewSlice.reducer;
