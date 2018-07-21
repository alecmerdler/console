/* eslint-disable no-undef, no-unused-vars */

import * as React from 'react';

import { FLAGS, connectToFlags } from '../../features';

export const withCatalogNamespace = <P extends {catalogNamespace: string}>(Component: React.ComponentType<P>) => connectToFlags(FLAGS.OPENSHIFT)(props => 
  <Component {...props} catalogNamespace={props.flags[FLAGS.OPENSHIFT] ? 'operator-lifecycle-manager' : 'tectonic-system'} />
);
