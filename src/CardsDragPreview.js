import React from "react";
import PropTypes from "prop-types";
import CardContent from "./CardContent";

const CardsDragPreview = ({ cards }) => {
  return (
    <div>
      {cards.slice(0, 3).map((card, i) => (
        <div
          key={card.id}
          className="card card-dragged"
          style={{
            zIndex: cards.length - i,
            transform: `rotateZ(${-i * 2.5}deg)`
          }}
        >
          <CardContent url={card.url} />
        </div>
      ))}
    </div>
  );
};

CardsDragPreview.propTypes = {
  cards: PropTypes.array
};

export default CardsDragPreview;
