import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

/**
 * Monkey patch for jest: ^23.x
 * 
 * Force jest to skip those test cases with no body.
 * The feature will be added in jest ^24 with `it.todo` notation. 
 * 
 * It still will be slightly different but I think they've come up with a good 
 * idea for the case.
 */
const originalTest = it;

it = (description, fn, ...args) => {
  if (!fn) return originalTest.skip(description, () => {});

  return originalTest(description, fn, ...args);
};

it.only = originalTest.only;
it.skip = originalTest.skip;
it.each = originalTest.each;
