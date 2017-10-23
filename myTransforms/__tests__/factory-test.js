const defineTest = require('jscodeshift/dist/testUtils').defineTest;

describe('factory', () => {
  defineTest(__dirname, 'factory', null, 'factory/factory');
  defineTest(__dirname, 'factory', null, 'factory/factoryWithoutUseStrict');
  defineTest(__dirname, 'factory', null, 'factory/factoryRequireReact');
});
