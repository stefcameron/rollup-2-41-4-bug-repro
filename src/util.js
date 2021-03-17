import * as rtv from 'rtvjs';
import { cssHexColorTs } from './typesets';

export const hexToRgb = function (color) {
  DEV && rtv.verify(color, cssHexColorTs);
  return color; // in reality, do the stuff to convert the color to 'rgb(...)'
};
