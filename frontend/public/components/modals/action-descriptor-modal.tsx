/* eslint-disable no-undef, no-unused-vars */

import * as React from 'react';

import { createModalLauncher, ModalTitle, ModalBody, ModalSubmitFooter } from '../factory/modal';
import { PromiseComponent } from '../utils';
import { ActionDescriptor } from '../cloud-services';
import { K8sKind, K8sResourceKind } from '../../module/k8s';

export class ActionDescriptorUpdateModal extends PromiseComponent {
  public state: ActionDescriptorUpdateModalState;

  constructor(public props: ActionDescriptorUpdateModalProps) {
    super(props);
  }

  private submit(event): void {
    event.preventDefault();

    const {obj, actionDescriptor, k8sPatch, model} = this.props;
    // TODO(alecmerdler): Use `x-descriptor` to determine the `op` type (replace/add/etc)
    const data = [{ op: 'replace', path: `/${actionDescriptor.path.replace('.', '/')}`, value: actionDescriptor.value }]

    this.handlePromise(k8sPatch(model, obj, data)).then(() => this.props.close());
  }

  render() {
    return <form onSubmit={this.submit.bind(this)} name="form" className="co-catalog-install-modal">
      <ModalTitle className="modal-header">{this.props.obj.kind} - {this.props.actionDescriptor.displayName}</ModalTitle>
      <ModalBody>
        <div>
          <p>{this.props.actionDescriptor.description}</p>
        </div>
      </ModalBody>
      <ModalSubmitFooter inProgress={this.state.inProgress} errorMessage={this.state.errorMessage} cancel={this.props.cancel.bind(this)} submitText="Submit" />
    </form>;
  }
}

export const actionDescriptorUpdateModal: (props: ModalProps) => {result: Promise<void>} = createModalLauncher(ActionDescriptorUpdateModal);

export type ActionDescriptorUpdateModalProps = {
  cancel: (e: Event) => void;
  close: () => void;
  k8sPatch: (kind: K8sKind, resource: K8sResourceKind, data: any) => Promise<any>;
  obj: K8sResourceKind;
  model: K8sKind;
  actionDescriptor: ActionDescriptor;
};

export type ActionDescriptorUpdateModalState = {
  inProgress: boolean;
  errorMessage: string;
};

type ModalProps = Omit<ActionDescriptorUpdateModalProps, 'cancel' | 'close'>;
