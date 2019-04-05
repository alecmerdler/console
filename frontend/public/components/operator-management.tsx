import * as React from 'react';

import { PageHeading } from './utils';
import { SubscriptionsPage } from './operator-lifecycle-manager/subscription';

export const OperatorManagementPage: React.SFC<OperatorManagementPageProps> = ({match}) =>
  <React.Fragment>
    <PageHeading detail={true} title="Operator Management" />
    <p className="co-help-text">Operator Subscriptions keep your services up to date by tracking a channel in a package. The approval strategy determines either manual or automatic updates.</p>
    <SubscriptionsPage match={match} namespace={match.params.ns} />
  </React.Fragment>;

/* eslint-disable no-undef */
export type OperatorManagementPageProps = {
  match: any;
};
