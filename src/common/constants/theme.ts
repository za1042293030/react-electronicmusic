import { Theme } from '../enums';
import { ITheme } from '../typings';

const THEME = new Map<Theme, ITheme>([
  [Theme.DARK, { color: '#000000', font: '#ffffff' }],
  [Theme.LIGHT, { color: '#ffffff', font: '#000000' }],
]);
export { THEME };
