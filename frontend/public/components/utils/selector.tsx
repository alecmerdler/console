/* eslint-disable no-undef, no-unused-vars */

import * as _ from 'lodash-es';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as classNames from 'classnames';

import { selectorToString } from '../../module/k8s/selector';
import { GroupVersionKind, referenceForModel } from '../../module/k8s';
import { PodModel } from '../../models';

const Requirement: React.SFC<RequirementProps> = ({kind, requirements, namespace = ''}) => {
  // Strip off any trailing '=' characters for valueless selectors
  const requirementAsString = selectorToString(requirements).replace(/=,/g, ',').replace(/=$/g, '');
  const requirementAsUrlEncodedString = encodeURIComponent(requirementAsString);

  let to;
  if (namespace) {
    to = `/search/ns/${namespace}?kind=${kind}&q=${requirementAsUrlEncodedString}`;
  } else {
    to = `/search/all-namespaces?kind=${kind}&q=${requirementAsUrlEncodedString}`;
  }

  return (
    <div className="co-m-requirement">
      <Link className={`co-text-${kind.toLowerCase()}`} to={to} tabIndex={-1}>
        <i className="fa fa-search"></i> {requirementAsString.replace(/,/g, ', ')}
      </Link>
    </div>
  );
};

export const Selector: React.SFC<SelectorProps> = ({kind = referenceForModel(PodModel), expand = false, selector = {}, namespace = undefined, style = {}}) => {
  const className = classNames('co-m-selector', {'co-m-selector--expand': expand});

  return <div className={className} style={style}>
    { _.isEmpty(selector)
      ? <p className="text-muted">No selector</p>
      : <Requirement kind={kind} requirements={selector} namespace={namespace} /> }
  </div>;
};

export type RequirementProps = {
  kind: GroupVersionKind;
  requirements: any;
  namespace: string;
};

export type SelectorProps = {
  kind?: GroupVersionKind;
  expand?: boolean;
  selector?: any;
  namespace?: string;
  style?: React.CSSProperties;
};
