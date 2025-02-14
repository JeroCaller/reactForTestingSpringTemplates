import actionTypes from "./actions";

/**
 * redux store 내 특정 state를 select할 때 쓰는 도구.
 */
const selectors = {
  auth: (state) => state.authReducer.auth,
  file: (state) => state.fileChangeReducer.isFileChanged,
};

/**
 * redux store 내 특정 state의 값을 변경하기 위한 dispatcher 모음.
 */
const dispatchers = {
  auth: {
    storeAuth: ( username, loggedIn ) => ({
      type: actionTypes.STORE_AUTH,
      payload: { username, loggedIn }
    }),
    clearAuth: () => ({
      type: actionTypes.CLEAR_AUTH,
    }),
  },
  file: {
    fileChanged: ( isFileChanged ) => ({
      type: actionTypes.FILE_CHANGED,
      payload: { isFileChanged }
    }),
  }, 
};

export {
  selectors,
  dispatchers,
};