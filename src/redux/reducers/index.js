import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import qtycartReducer from "./qtycart"

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  qtycart: qtycartReducer
});
