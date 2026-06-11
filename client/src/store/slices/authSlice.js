import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

const initialState = {
  user: typeof window !== "undefined" ? (() => {
    try {
      const item = localStorage.getItem("user");
      return item && item !== "undefined" ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  })() : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: typeof window !== "undefined" ? !!localStorage.getItem("token") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
  },
  extraReducers: (builder) => {
    const handleAuth = (state, { payload }) => {
      if (payload.requiresOtp) return;
      state.user = payload.user;
      state.token = payload.token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", payload.token);
        localStorage.setItem("user", JSON.stringify(payload.user));
      }
    };

    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, handleAuth)
      .addMatcher(authApi.endpoints.verifyAdminOtp.matchFulfilled, handleAuth)
      .addMatcher(authApi.endpoints.register.matchFulfilled, handleAuth)
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        // Don't clear token here, wait for logout
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
