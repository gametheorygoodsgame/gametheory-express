import {Move} from './move';

export interface Player {
  id: string,
  name: string,
  moves: Move[],
  score: number
}