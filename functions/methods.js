function response_Parse(cardData) {

    card_decks = [];
    const value = cardData.cards[0].value;
    const suit = cardData.cards[0].suit;
    const image = cardData.cards[0].image;
    const value_num = face_Cards(value);

    card_decks.push({
        'card': value + " of " + suit,
        'image': image,
        'value': value,
        'value_num': value_num,
    });
    return card_decks;
};


function face_Cards(value_num) {
    if (value_num =="ACE") { // requires a different value for non-numerical cards
        value_num = 14;
    } else if (value_num == "JACK") {
        value_num = 11;
    } else if (value_num == "QUEEN") {
        value_num = 12;
    } else if (value_num == "KING") {
        value_num = 13;
    } else {
        value_num == value_num;
    }
    return value_num;
}

module.exports = { response_Parse };