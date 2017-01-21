import dirname from '../utils/dirname';
import join from '../utils/join';

export const isWebpack = loadFunc => {
  return (
    loadFunc.match(/\/\* System\.import \*\/\(([^\)]*)\)/) ||
    // webpack minimized
    loadFunc.match(/function[^}]*return[^}]*[a-zA-Z]\.[a-zA-Z]\([0-9]*\)\.then\([a-zA-Z]\.bind\(null, ?[0-9]*\)/) ||
    // webpack normal
    loadFunc.match(/__webpack_require__/)
  ) ? true : false;
};

export const isSystemImportTransformer = loadFunc => {
  return loadFunc.match(/ImportTransformer/) ? true : false;
};

export const getWebpackId = loadFunc => {
  let matches = loadFunc.match(/\/\* System\.import \*\/\(([^\)]*)\)/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  // webpack minimized
  matches = loadFunc.match(/function[^}]*return[^}]*[a-zA-Z]\.[a-zA-Z]\(([0-9]*)\)\.then\([a-zA-Z]\.bind\(null, ?[0-9]*\)/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
  // webpack normal
  matches = loadFunc.match(/function[^}]*return[^}]*\(([0-9]*)\).then/);
  if (typeof matches === 'object' && matches !== null && typeof matches[1] !== 'undefined') {
    return matches[1];
  }
   return null;
};

export const infoFromWebpack = loadFunc => ({
  id: getWebpackId(loadFunc)
});

export const infoFromSystemImportTransformer = (loadFunc, module) => {
  const matches = loadFunc.match(/require\(([^)\]]*)\)/);
  let file = matches[1].replace(/[\('"\\]*/g, '');
  return {
    filename: join(dirname(module.parent.filename), file)
  };
};

export default (currentModule, loadFunc) => {
  loadFunc = loadFunc.toString();
  let finalModule = {};
  if (isSystemImportTransformer(loadFunc)) {
    finalModule = {
      type: 'systemImportTransformer',
      ...finalModule,
      ...infoFromSystemImportTransformer(loadFunc, currentModule)
    };
  } else if (isWebpack(loadFunc)) {
    finalModule = {
      type: 'webpack',
      ...finalModule,
      ...infoFromWebpack(loadFunc)
    };
  }

  return () => {
    return finalModule;
  };
};
