/* eslint-disable no-unused-vars, no-undef */

import * as React from 'react';

import { Firehose } from './firehose';
import { K8sResourceKind } from '../../module/k8s';

export type WithNamespace = <P extends WithNamespaceProps>(Component: React.ComponentType<P>) => React.ComponentType<Omit<P, keyof WithNamespaceProps>>;
export const withNamespace: WithNamespace = Component => props => <Firehose resources={[{kind: 'Namespace', name: props.ns, isList: false, prop: 'namespaceObj'}]}>
  {/* FIXME(alecmerdler): Hack because `Firehose` injects props without TypeScript knowing about it */}
  <Component {...props as any} />
</Firehose>;

export type WithNamespaceProps = {namespaceObj: {loaded: boolean, data: K8sResourceKind}, namespace: string};
