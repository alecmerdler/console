/* eslint-disable no-undef, no-unused-vars */

import * as _ from 'lodash-es';
import * as React from 'react';

/**
 * FIXME(alecmerdler): This is causing runtime circular dependency errors (`Uncaught ReferenceError: SafetyFirst is not defined`)
 * Confirmed by find/replace `extends React.Component` to `extends React.Component`.
 * 
 * - [ ] Create `withSafetyFirst` HOC to use composition rather than inheritence (TypeScript does not handle inheritance well)
 * - [ ] Refactor all `extends SafetyFirst` to use `withSafetyFirst`
 * - [ ] Remove all calls to `super.componentWillUnmount()` and `super.componentDidMount()`
 * - [ ] Delete `SafetyFirst` class below
 */

export type WithSafetyFirstProps = {
  // TODO(alecmerdler): Ensure state matches
  setState: (state: any, callback?: () => void) => void;
};

export type WithSafetyFirst = <P extends WithSafetyFirstProps, S extends {}>(C: React.ComponentType<P>) => React.ComponentType<Omit<P, keyof WithSafetyFirstProps>>;

/**
 * React doesn't like it when you call setState unless your component is mounted.
 * TODO(alecmerdler): Properly document when you would want to use this HOC.
 */
export const withSafetyFirst: WithSafetyFirst = UnsafeComponent => {
  class SafetyFirst extends React.Component<any> {
    unMounted_: boolean;
    isMounted_: boolean;
    setState_: (state: any, callback?: () => void) => void;

    constructor(props) {
      super(props);
      this.unMounted_ = false;
      this.isMounted_ = false;
      this.setState_ = this.setState;
      this.setState = (arg0, arg1) => {
        // NOP in the case that we are unmounting
        if (this.unMounted_) {
          return;
        }

        // business as usual...
        if (this.isMounted_) {
          return this.setState_(arg0, arg1);
        }

        // We are in the constructor...
        // https://reactjs.org/docs/react-component.html#setstate
        const nextState = _.isFunction(arg0)
          ? arg0(this.state || {}, this.props)
          : arg0;

        this.state = Object.assign({}, this.state || {}, nextState);

        if (_.isFunction(arg1)) {
          return arg1();
        }
      };
    }

    componentWillUnmount() {
      this.unMounted_ = true;
      this.isMounted_ = false;
    }

    componentDidMount() {
      this.isMounted_ = true;
    }

    render() {
      return <UnsafeComponent {...this.props} setState={this.setState_} />
    }
  }

  return SafetyFirst;
};

export type SafetyFirstProps = {
  
};
