import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── AI Generation State ───
// Full implementation arrives in Sprint 5 (Smart Parallel Generation,
// streaming code output, Baby Tiger coding panel). This minimal slice
// tracks AI source (local Ollama vs Groq fallback) and streaming text
// so the store compiles for Sprint 1.

export type AISource = "ollama" | "groq" | "unknown";

interface AIState {
  source: AISource;
  isGenerating: boolean;
  streamingContent: string;
  lastError: string | null;
}

const initialState: AIState = {
  source: "unknown",
  isGenerating: false,
  streamingContent: "",
  lastError: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setAISource: (state, action: PayloadAction<AISource>) => {
      state.source = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
      if (!action.payload) state.streamingContent = "";
    },
    appendStreamingContent: (state, action: PayloadAction<string>) => {
      state.streamingContent += action.payload;
    },
    clearStreamingContent: (state) => {
      state.streamingContent = "";
    },
    setAIError: (state, action: PayloadAction<string | null>) => {
      state.lastError = action.payload;
    },
  },
});

export const {
  setAISource,
  setGenerating,
  appendStreamingContent,
  clearStreamingContent,
  setAIError,
} = aiSlice.actions;

export default aiSlice.reducer;
