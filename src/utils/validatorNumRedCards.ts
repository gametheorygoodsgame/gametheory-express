import { MoveNumRedCardsEnum } from '@gametheorygoodsgame/gametheory-openapi';
import { ValidationError } from './validationError';

export function validateNumRedCards(number: number): number {
  if (number === MoveNumRedCardsEnum.NUMBER_0
      || number === MoveNumRedCardsEnum.NUMBER_1
      || number === MoveNumRedCardsEnum.NUMBER_2) {
    throw new ValidationError('Invalid number of red Cards');
  }
  return number;
}
