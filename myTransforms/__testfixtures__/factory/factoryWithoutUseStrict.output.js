/**
 * We should keep this comment
 */

import React from 'react';

export default function() {

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
