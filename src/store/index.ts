import { IAction, IStoreState } from '@/common/typings';
import { createStore, Store, applyMiddleware, combineReducers } from 'redux';
import { LoginReducer } from './reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AudioReducer } from './reducers/Audio';

const allReducers = combineReducers<IStoreState, IAction>({
  LoginReducer,
  AudioReducer,
});
const store: Store<IStoreState, IAction> = createStore(
  allReducers,
  composeWithDevTools(applyMiddleware(thunk))
);
export default store;
