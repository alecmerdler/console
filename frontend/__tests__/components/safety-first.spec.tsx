import * as React from 'react';
import { mount } from 'enzyme';

import { withSafetyFirst } from '../../public/components/safety-first';

class Unsafe extends React.Component<UnsafeProps> {
  render() {
    return <a onClick={() => this.props.unmountSelf().then(() => this.setState({}))}></a>
  }
}

describe('withSafetyFirst', () => {

  it('unsafely calls `setState()` without `withSafetyFirst`', (done) => {
    spyOn(Unsafe.prototype, 'setState').and.callFake(() => {
      done();
    });

    let wrapper = mount(<Unsafe setState={null} />);
    wrapper = wrapper.setProps({unmountSelf: () => Promise.resolve(wrapper.unmount())});

    wrapper.find('a').simulate('click');
  });
  
  it('prevents wrapped component from calling `setState()` if it is unmounted', () => {
    const Safe = withSafetyFirst(Unsafe);

    spyOn(Unsafe.prototype, 'setState').and.callFake(() => {
      fail('Should not call `setState()`');
    });

    let wrapper = mount(<Safe />);
    wrapper.setProps({unmountSelf: () => Promise.resolve(wrapper.unmount())});

    wrapper.find(Unsafe).find('a').simulate('click');
  });

  it('allows wrapped component to call `setState()` if it is mounted', () => {

  });
});

type UnsafeProps = {
  unmountSelf?: () => Promise<{}>;
  setState: (newState: any) => void;
}
