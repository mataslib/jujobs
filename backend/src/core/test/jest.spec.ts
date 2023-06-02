import {testJestCanImport} from './jest';

describe('Jest works', () => {
  it('it works', () => {
    expect(true).toBeTruthy();
  });

  it('it can import my things', () => {
    expect(testJestCanImport()).toBeTruthy();
  });

  it('it can import node things', async () => {
    // await fetch('http://localhost:9999.com');

    expect(testJestCanImport()).toBeTruthy();
  });
});
