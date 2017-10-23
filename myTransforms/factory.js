module.exports = function (file, api) {
  const { jscodeshift } = api;
  const { statement, statements } = jscodeshift.template;

  function reprintComment(node) {
    if (node.type === 'Block') {
      return jscodeshift.block(node.value);
    } else if (node.type === 'Line') {
      return jscodeshift.line(node.value);
    }
    return node;
  }

  function applyCommentsToStatements(nodes, comments) {
    if (comments) {
      nodes[0].comments = comments.map(comment => reprintComment(comment));
    }
    return nodes;
  }

  function reprintNode(node) {
    if (jscodeshift.ExpressionStatement.check(node)) {
      return statement`${node.expression}`;
    }

    if (jscodeshift.VariableDeclaration.check(node)) {
      const declaration = node.declarations[0];
      return jscodeshift.variableDeclaration(node.kind, [
        jscodeshift.variableDeclarator(declaration.id, declaration.init),
      ]);
    }

    if (jscodeshift.ImportDeclaration.check(node) && node.importKind === 'type') {
      // TODO: Properly remove new lines from the node.
      return node;
    }

    return node;
  }

  function hasUseStrict(root) {
    const firstPath = root
      .find(jscodeshift.Program)
      .get('body')
      .get(0);

    return jscodeshift.ExpressionStatement.check(firstPath.value) &&
      firstPath.value.expression.rawValue === 'use strict';
  }

  /**
   * Move `module.exports` to `export default`
   */
  function exportsToDefault(p) {
    // remove arguments
    const right = {
      ...p.value.right,
      params: []
    };
    const exportDecl = jscodeshift.exportDeclaration(true, right);
    exportDecl.comments = p.parentPath.value.comments;
    jscodeshift(p.parentPath).replaceWith(exportDecl);
  }

  const root = jscodeshift(file.source);

  root
    .find(jscodeshift.VariableDeclaration, {
      declarations: [
        {
          id: {
            name: 'React'
          }
        }
      ]
    })
    .filter(p => p.parentPath.name === 'body')
    .replaceWith(statements`
        import React from 'react';
    `);

  const hasReactImport = root
    .find(jscodeshift.ImportDeclaration, {
      original: {
        source: {
          rawValue: 'react'
        }
      }
    })
    .size() > 0;

  if (!hasReactImport) {
    const firstPath = root
      .find(jscodeshift.Program)
      .get('body')
      .get(hasUseStrict(root) ? 1 : 0);

    jscodeshift(firstPath)
      .replaceWith(applyCommentsToStatements(statements`
          import React from 'react';
          ${reprintNode(firstPath.value)};
        `, firstPath.value.comments));
  }

  root
    .find(jscodeshift.AssignmentExpression, {
      operator: '=',
      left: {
        object: { name: 'module' },
        property: { name: 'exports' },
      }
    })
    .filter(p => p.parentPath.parentPath.name === 'body')
    .forEach(exportsToDefault);

  return root.toSource({
    quote: 'single'
  });
};