import * as React from 'react';
import { mount } from 'enzyme';

import {CatalogTile} from 'patternfly-react-extensions';
import {FilterSidePanel} from 'patternfly-react-extensions';

import { MarketplaceItemModal } from '../../../public/components/marketplace/marketplace-item-modal';
import { MarketplaceListPage } from '../../../public/components/marketplace/kubernetes-marketplace';
import { marketplaceListPageProps } from '../../../__mocks__/marketplaceItemsMocks';

describe(MarketplaceListPage.displayName, () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<MarketplaceListPage {...marketplaceListPageProps} />);
  });

  it('renders tiles correctly', () => {
    const tiles = wrapper.find(CatalogTile);

    expect(tiles.exists()).toBe(true);
    expect(tiles.length).toEqual(5);

    const amqTileProps = tiles.at(0).props();
    const amqPackageManifest = marketplaceListPageProps.packagemanifests.data[0];
    const amqIcon = (amqPackageManifest.status.channels[0].currentCSVDesc as any).icon[0];
    expect(amqTileProps.title).toEqual(amqPackageManifest.metadata.name);
    expect(amqTileProps.iconImg).toEqual(`data:${amqIcon.mediatype};base64,${amqIcon.base64data}`);
    expect(amqTileProps.iconClass).toBe(null);
    expect(amqTileProps.vendor).toEqual(`Provided by ${amqPackageManifest.metadata.labels.provider}`);
    expect(amqTileProps.description.startsWith('**Red Hat AMQ Streams** is a massively scalable, distributed, and high performance data streaming platform based on the Apache Kafka project.')).toBe(true);

    const prometheusTileProps = tiles.at(3).props();
    const prometheusPackageManifest = marketplaceListPageProps.packagemanifests.data[3];
    const prometheusIcon = (prometheusPackageManifest.status.channels[0].currentCSVDesc as any).icon[0];
    expect(prometheusTileProps.title).toEqual(prometheusPackageManifest.metadata.name);
    expect(prometheusTileProps.iconImg).toEqual(`data:${prometheusIcon.mediatype};base64,${prometheusIcon.base64data}`);
    expect(prometheusTileProps.iconClass).toBe(null);
    expect(prometheusTileProps.vendor).toEqual(`Provided by ${prometheusPackageManifest.metadata.labels.provider}`);
    expect(prometheusTileProps.description.startsWith('The Prometheus Operator for Kubernetes provides easy monitoring definitions for Kubernetes services and deployment and management of Prometheus instances.')).toBe(true);
  });

  it('renders category filter controls', () => {
    const filterItems = wrapper.find(FilterSidePanel.CategoryItem);
    expect(filterItems.exists()).toBe(true);

    // At some point the different 'Red Hat' providers should be detected to be the same
    expect(filterItems.length).toEqual(4); // Filter by Provider
    expect(filterItems.at(0).props().count).toBe(1); // total count for Red Hat, Inc.
    expect(filterItems.at(1).props().count).toBe(1); // total count for CoreOS, Inc
    expect(filterItems.at(2).props().count).toBe(1); // total count for Red Hat, Inc
    expect(filterItems.at(3).props().count).toBe(2); // total count for Red Hat
  });

  it('renders modal correctly on tile click', () => {
    const tiles = wrapper.find(CatalogTile);
    expect(tiles.exists()).toBe(true);

    // Click tile to render modal
    tiles.at(0).simulate('click');
    const modal = wrapper.find(MarketplaceItemModal);
    expect(modal.exists()).toBe(true);

    // Check modal for valid props
    const modalItem = modal.at(0).props().item;
    const amqPackageManifest = marketplaceListPageProps.packagemanifests.data[0];
    const amqIcon = (amqPackageManifest.status.channels[0].currentCSVDesc as any).icon[0];
    expect(modalItem.name).toEqual(amqPackageManifest.metadata.name);
    expect(modalItem.imgUrl).toEqual(`data:${amqIcon.mediatype};base64,${amqIcon.base64data}`);
    expect(modalItem.iconClass).toBe(null);
    expect(modalItem.provider).toEqual(amqPackageManifest.metadata.labels.provider);
    expect(modalItem.description.startsWith('**Red Hat AMQ Streams** is a massively scalable, distributed, and high performance data streaming platform based on the Apache Kafka project.')).toBe(true);
  });

  // TODO: Add tests for categorization

});
