import * as _ from 'lodash-es';
import * as React from 'react';
import { Tooltip } from './tooltip';

import { K8sKind, K8sResourceKind } from '../../module/k8s';
import { configureReplicaCountModal } from '../modals';
import { LoadingInline, pluralize } from './';
import { useSafetyFirst } from '../safety-first';

/* eslint-disable no-undef, no-unused-vars */
type DPCProps = {
  resource: K8sResourceKind;
  resourceKind: K8sKind;
};
/* eslint-enable no-undef, no-unused-vars */

/**
 * Common representation of desired / up-to-date / matching pods for Deployment like things.
 */
export const DeploymentPodCounts: React.FC<DPCProps> = (props) => {
  const [desiredCount, setDesiredCount] = useSafetyFirst(-1);
  const [waitingForUpdate, setWaitingForUpdate] = useSafetyFirst(false);

  if (waitingForUpdate && desiredCount === _.get(props, 'resource.spec.replicas')) {
    setWaitingForUpdate(false);
  }

  const openReplicaCountModal = event => {
    event.preventDefault();
    event.target.blur();

    const {resourceKind, resource} = props;

    configureReplicaCountModal({
      resourceKind, resource,
      invalidateState: (waiting, count) => {
        setWaitingForUpdate(waiting);
        setDesiredCount(count);
      },
    });
  };

  const { resource, resourceKind } = props;
  const { spec, status } = resource;

  return <div className="co-m-pane__body-group">
    <div className="co-detail-table">
      <div className="co-detail-table__row row">
        <div className="co-detail-table__section col-sm-3">
          <dl className="co-m-pane__details">
            <dt className="co-detail-table__section-header">Desired Count</dt>
            <dd>
              {
                 waitingForUpdate
                  ? <LoadingInline />
                  : <button type="button" className="btn btn-link co-modal-btn-link" onClick={openReplicaCountModal}>{ pluralize(spec.replicas, 'pod') }</button>
              }
            </dd>
          </dl>
        </div>
        <div className="co-detail-table__section col-sm-3">
          <dl className="co-m-pane__details">
            <dt className="co-detail-table__section-header">Up-to-date Count</dt>
            <dd>
              <Tooltip content={`Total number of non-terminated pods targeted by this ${resourceKind.label} that have the desired template spec.`}>
                {pluralize(status.updatedReplicas, 'pod')}
              </Tooltip>
            </dd>
          </dl>
        </div>
        <div className="co-detail-table__section co-detail-table__section--last col-sm-6">
          <dl className="co-m-pane__details">
            <dt className="co-detail-table__section-header">Matching Pods</dt>
            <dd>
              <Tooltip content={`Total number of non-terminated pods targeted by this ${resourceKind.label} (their labels match the selector).`}>
                {pluralize(status.replicas, 'pod')}
              </Tooltip>
            </dd>
          </dl>
          <div className="co-detail-table__bracket"></div>
          <div className="co-detail-table__breakdown">
            <Tooltip content="Total number of available pods (ready for at least minReadySeconds) targeted by this deployment.">
              {status.availableReplicas || 0} available
            </Tooltip>
            <Tooltip content={`Total number of unavailable pods targeted by this ${resourceKind.label}.`}>{status.unavailableReplicas || 0} unavailable</Tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
