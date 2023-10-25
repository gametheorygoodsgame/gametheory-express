interface PublicGoodsGameMove {
    id: string; // UUID
    playerId: string; // UUID of the player making the move
    cardsThrown: {
        //blackCards: number;
        redCards: number;
    };
}

export default PublicGoodsGameMove;