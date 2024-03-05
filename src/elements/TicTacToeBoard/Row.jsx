import React from "react";
import Square from "./Square";

function Row({ ...props }) {

  return (
    <div className="row">
      {props.columns.map((text, index) => (
        <Square
          row={props.row}
          turn={props.turn}
          square={index}
          key={`rowSquare${index}`}
          value={text}
          {...props}
        />
      ))}
    </div>
  );
}

export default Row;
