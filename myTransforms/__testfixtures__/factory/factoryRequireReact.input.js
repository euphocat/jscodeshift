/**
 * We should keep this comment
 */
'use strict';
const React = require('react');

module.exports = function (React) {

  const CLASSNAMES = {
    container: 'actionsList'
  };

  /**
   * Actions list
   * This component is used to display actions
   */
  return React.createClass({
    displayName: 'ActionsList',

    statics: {
      CLASSNAMES
    },

    render() {
      const { children } = this.props;

      return (
        <div className={CLASSNAMES.container}>
          {children}
        </div>
      );
    }
  });
};
