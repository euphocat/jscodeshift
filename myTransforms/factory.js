const types = require('ast-types');
const b = types.builders;

module.exports = function(file, api) {
    const {jscodeshift} = api;
    const {statement} = jscodeshift.template;

    const root = jscodeshift(file.source);


    let hasReact = false;
    root.find(jscodeshift.ImportDeclaration).forEach(im => {
        //console.log(im);
        const importAs = im.value.original.specifiers.filter(s => s.local.name === 'React');

        if(importAs.length === 1 && im.value.original.source.rawValue === 'react') {
            hasReact = true;
        }
    });

    if(!hasReact) {

    }

    const outputOptions = {
        quote: 'single'
    };

    return root.find(jscodeshift.Literal).filter((l) => {
        return l.value.rawValue === 'use strict';
    }).remove().toSource(outputOptions);

};