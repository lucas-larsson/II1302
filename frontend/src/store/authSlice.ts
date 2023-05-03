import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    surname: string;
    email: string;
    password: string;
    person_id: number;
  } | null;
  session: {
    session_id: string;
    person_id: number;
    expiration_date: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  session: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload;
    },
  },
});

export const { setAuthenticated, setUser, setSession } = authSlice.actions;
export default authSlice.reducer;
