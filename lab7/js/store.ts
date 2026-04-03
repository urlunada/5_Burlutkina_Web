import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: {
    city: string;
    street: string;
    suite: string;
    zipcode: string;
  };
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface APIState {
  posts: Post[];
  users: User[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const API_BASE = "https://jsonplaceholder.typicode.com";
const initialState: APIState = {
  posts: [],
  users: [],
  comments: [],
  loading: false,
  error: null,
  successMessage: null,
};

export const fetchPosts = createAsyncThunk("api/fetchPosts", async () => {
  const response = await fetch(`${API_BASE}/posts`);
  return await response.json();
});

export const fetchUsers = createAsyncThunk("api/fetchUsers", async () => {
  const response = await fetch(`${API_BASE}/users`);
  return await response.json();
});

export const fetchComments = createAsyncThunk("api/fetchComments", async () => {
  const response = await fetch(`${API_BASE}/comments?postId=1`);
  return await response.json();
});

export const createPost = createAsyncThunk(
  "api/createPost",
  async (data: Omit<Post, "id">) => {
    const response = await fetch(`${API_BASE}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
);

export const deleteComment = createAsyncThunk(
  "api/deleteComment",
  async (id: number) => {
    await fetch(`${API_BASE}/comments/${id}`, { method: "DELETE" });
    return id;
  },
);

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.successMessage = `Загружено ${action.payload.length} постов`;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки постов";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.successMessage = `Загружено ${action.payload.length} пользователей`;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки пользователей";
      })
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
        state.successMessage = `Загружено ${action.payload.length} комментариев`;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки комментариев";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.successMessage = "Пост успешно создан!";
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c.id !== action.payload);
        state.successMessage = `Комментарий #${action.payload} удалён!`;
      });
  },
});

export const { clearMessages } = apiSlice.actions;
export const store = configureStore({ reducer: { api: apiSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
