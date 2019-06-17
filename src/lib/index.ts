import 'react-app-polyfill/ie11';
import trimLeft from 'string.prototype.trimleft';
if (!String.prototype.trimLeft) {
    trimLeft.shim();
}

export * from './date';
export * from './date-annotator';
export * from './holiday';
export * from './roman-date';
