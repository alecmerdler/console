/* eslint-disable no-undef, no-unused-vars */

import * as React from 'react';
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import { match } from 'react-router-dom';

import { FLAGS as featureFlags } from '../../features';
import { LoadingBox } from '../utils/status-box';

type StateProps = {catalogNamespace?: string};
type OwnProps = {match: match<{ns?: string}>};
type AllProps = StateProps & OwnProps;
type State = {k8s: ImmutableMap<string, any>, FLAGS: ImmutableMap<string, boolean>};

export const withCatalogNamespace = <P extends AllProps>(Component: React.ComponentType<P>) => connect((state: State, props: OwnProps) => {
  const nsKey = state.FLAGS.get(featureFlags.OPENSHIFT) ? 'projects' : 'namespaces';
  if (state.k8s.getIn([nsKey, 'loaded'])) {
    return {
      catalogNamespace: (props.match.params.ns
        ? state.k8s.getIn([nsKey, 'data', props.match.params.ns])
        : state.k8s.getIn([nsKey, 'data'], ImmutableMap()).first())
        .getIn(['metadata', 'annotations', 'alm-manager']).split('.')[0],
    } as StateProps;
  }
  return {} as StateProps;
}, null)((props) => props.catalogNamespace ? <Component {...props} /> : <LoadingBox />);
