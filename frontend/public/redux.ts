import { applyMiddleware, combineReducers, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

import { featureReducer, featureReducerName, FeatureState } from './features';
import { monitoringReducer, monitoringReducerName, MonitoringState } from './monitoring';
import k8sReducers from './module/k8s/k8s-reducers';
import UIReducers from './ui/ui-reducers';

// TODO(alecmerdler): Use imported state types
export type AppStore = {
  k8s: any;
  UI: any;
  form: any;  
  [featureReducerName]: FeatureState;
  [monitoringReducerName]: MonitoringState;
};

const reducers = combineReducers<AppStore>({
  k8s: k8sReducers, // data
  UI: UIReducers,
  form: formReducer,
  [featureReducerName]: featureReducer,
  [monitoringReducerName]: monitoringReducer,
});

const store = createStore<AppStore>(reducers, {} as AppStore, applyMiddleware(thunk));

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  // Expose Redux store for debugging
  (window as any).store = store;
}

export default store;
