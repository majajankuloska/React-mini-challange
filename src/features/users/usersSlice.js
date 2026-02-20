import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// ─── Async Thunk ──────────────────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchQuery: '',
    sortBy: 'default', // 'default' | 'name-asc' | 'name-desc' | 'company'
  },
  reducers: {
    addUser(state, action) {
      state.list.unshift(action.payload);
    },
    updateUser(state, action) {
      const idx = state.list.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    deleteUser(state, action) {
      state.list = state.list.filter((u) => u.id !== action.payload);
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addUser, updateUser, deleteUser, setSearchQuery, setSortBy } =
  usersSlice.actions;

export default usersSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllUsers = (state) => state.users.list;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;
export const selectSearchQuery = (state) => state.users.searchQuery;
export const selectSortBy = (state) => state.users.sortBy;

export const selectUserById = (id) => (state) =>
  state.users.list.find((u) => u.id === Number(id));

export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectSearchQuery, selectSortBy],
  (users, query, sortBy) => {
    let filtered = users;

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.company?.name?.toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered];
    if (sortBy === 'name-asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'name-desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'company')
      sorted.sort((a, b) => (a.company?.name ?? '').localeCompare(b.company?.name ?? ''));

    return sorted;
  }
);
