import { get } from 'svelte/store';
import { lyr } from '../../stores.js'

// Test l'activation d'une couche / layer
export const isLyr = (layer) => get(lyr).includes(layer)