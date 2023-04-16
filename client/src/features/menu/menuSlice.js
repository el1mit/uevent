import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
	name: 'menu',
	initialState: {
		collapsed: JSON.parse(localStorage.getItem('menuCollapsed')) || false,
		menuKey: JSON.parse(localStorage.getItem('menuKey')) || 1,
	},
	reducers: {
		setCollapsed: (state, action) => {
			localStorage.setItem('menuCollapsed', JSON.stringify(action.payload));
			state.collapsed = JSON.parse(localStorage.getItem('menuCollapsed'));
		},
		setMenuKey: (state, action) => {
			state.menuKey = action.payload;
		},
	},
});

export const { setCollapsed, setMenuKey } = menuSlice.actions;

export default menuSlice.reducer;

export const selectMenuState = (state) => state.menu.collapsed;
export const selectMenuKey = (state) => state.menu.menuKey;
