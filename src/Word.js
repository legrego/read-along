import React from "react";

export function Word({ word, isHighlighted, highlightColor }) {
  const classes = ["ra-word"];
  const style = {};
  if (isHighlighted) {
    style.color = highlightColor;
  }
  return (
    <span className={classes.join(" ")} style={style}>
      {word}
    </span>
  );
}
