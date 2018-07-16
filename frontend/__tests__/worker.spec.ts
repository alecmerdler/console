import { $run, $worker } from '../public/worker';

describe('$run', () => {

});

describe('$worker', () => {

  it('returns a Worker', () => {
    const worker = $worker((e) => {

    });

    expect(worker instanceof Worker).toBe(true);
  });
});
