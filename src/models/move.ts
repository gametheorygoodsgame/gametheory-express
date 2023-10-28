export interface Move {
    numRedCards: ValidNumRedCards,
    numTurn: number
}

export type ValidNumRedCards = 0 | 1 | 2;