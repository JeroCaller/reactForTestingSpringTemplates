import { configureStore } from "@reduxjs/toolkit";
import { authReducer, fileChangeReducer, productReducer } from './reducer';

const store = configureStore({
	reducer: {
		authReducer: authReducer, 
		fileChangeReducer: fileChangeReducer,
		productReducer: productReducer,
	}
});

export default store;
