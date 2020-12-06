import React, { useReducer } from "react";
import CardDragLayer from "./CardDragLayer";
import Card from "./Card";

const TOTAL_ITEMS = 50;

const cardReducer = (state, action) => {
  switch (action.type) {
    case "CLEAR_SELECTION":
      return {
        ...state,
        selectedCards: init_state.selectedCards,
        lastSelectedIndex: init_state.lastSelectedIndex
      };
    case "UPDATE_SELECTION":
      return {
        ...state,
        selectedCards: action.newSelectedCards,
        lastSelectedIndex: action.newLastSelectedIndex
      };
    case "REARRANGE_CARDS":
      return { ...state, cards: action.newCards };
    case "SET_INSERTINDEX":
      return {
        ...state,
        dragIndex: action.dragIndex,
        hoverIndex: action.hoverIndex,
        insertIndex: action.insertIndex
      };
    default:
      throw new Error();
  }
};

const init_cards = [...Array(TOTAL_ITEMS).keys()].map((i) => ({
  id: i + 1,
  order: i,
  url: "https://picsum.photos/80/45?random&" + i
}));

const init_state = {
  cards: init_cards,
  selectedCards: [],
  lastSelectedIndex: -1,
  dragIndex: -1,
  hoverIndex: -1,
  insertIndex: -1,
  isDragging: false
};

export default function Container() {
  const [state, dispatch] = useReducer(cardReducer, init_state);

  const clearItemSelection = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const handleItemSelection = (index, cmdKey, shiftKey) => {
    let newSelectedCards;
    const cards = state.cards;
    const card = index < 0 ? "" : cards[index];
    const newLastSelectedIndex = index;

    if (!cmdKey && !shiftKey) {
      newSelectedCards = [card];
    } else if (shiftKey) {
      if (state.lastSelectedIndex >= index) {
        newSelectedCards = [].concat.apply(
          state.selectedCards,
          cards.slice(index, state.lastSelectedIndex)
        );
      } else {
        newSelectedCards = [].concat.apply(
          state.selectedCards,
          cards.slice(state.lastSelectedIndex + 1, index + 1)
        );
      }
    } else if (cmdKey) {
      const foundIndex = state.selectedCards.findIndex((f) => f === card);
      // If found remove it to unselect it.
      if (foundIndex >= 0) {
        newSelectedCards = [
          ...state.selectedCards.slice(0, foundIndex),
          ...state.selectedCards.slice(foundIndex + 1)
        ];
      } else {
        newSelectedCards = [...state.selectedCards, card];
      }
    }
    const finalList = cards
      ? cards.filter((f) => newSelectedCards.find((a) => a === f))
      : [];
    dispatch({
      type: "UPDATE_SELECTION",
      newSelectedCards: finalList,
      newLastSelectedIndex: newLastSelectedIndex
    });
  };

  const rearrangeCards = (dragItem) => {
    let cards = state.cards.slice();
    const draggedCards = dragItem.cards;

    let dividerIndex;
    if ((state.insertIndex >= 0) & (state.insertIndex < cards.length)) {
      dividerIndex = state.insertIndex;
    } else {
      // If missing insert index, put the dragged cards to the end of the queue
      dividerIndex = cards.length;
    }
    const upperHalfRemainingCards = cards
      .slice(0, dividerIndex)
      .filter((c) => !draggedCards.find((dc) => dc.id === c.id));
    const lowerHalfRemainingCards = cards
      .slice(dividerIndex)
      .filter((c) => !draggedCards.find((dc) => dc.id === c.id));
    const newCards = [
      ...upperHalfRemainingCards,
      ...draggedCards,
      ...lowerHalfRemainingCards
    ];
    dispatch({ type: "REARRANGE_CARDS", newCards: newCards });
  };

  const setInsertIndex = (dragIndex, hoverIndex, newInsertIndex) => {
    if (
      state.dragIndex === dragIndex &&
      state.hoverIndex === hoverIndex &&
      state.insertIndex === newInsertIndex
    ) {
      return;
    }
    dispatch({
      type: "SET_INSERTINDEX",
      dragIndex: dragIndex,
      hoverIndex: hoverIndex,
      insertIndex: newInsertIndex
    });
  };

  return (
    <main>
      <CardDragLayer />
      <div className="container">
        {state.cards.map((card, i) => {
          const insertLineOnLeft =
            state.hoverIndex === i && state.insertIndex === i;
          const insertLineOnRight =
            state.hoverIndex === i && state.insertIndex === i + 1;
          return (
            <Card
              key={"card-" + card.id}
              id={card.id}
              index={i}
              order={card.order}
              url={card.url}
              selectedCards={state.selectedCards}
              rearrangeCards={rearrangeCards}
              setInsertIndex={setInsertIndex}
              onSelectionChange={handleItemSelection}
              clearItemSelection={clearItemSelection}
              isSelected={state.selectedCards.includes(card)}
              insertLineOnLeft={insertLineOnLeft}
              insertLineOnRight={insertLineOnRight}
            />
          );
        })}
      </div>
    </main>
  );
}
