import React, { useEffect, useRef, useState } from "react";
import { Word } from "./Word";
import { useKey } from "react-use";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function Sentence({
  sentence,
  animating,
  autoAdvance,
  onAnimateComplete,
  textColor,
  highlightColor,
  highlightSpeed,
}) {
  const words = sentence.split(/\s/g);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useInterval(() => {
    if (autoAdvance && animating) {
      if (highlightedIndex < words.length - 1) {
        setHighlightedIndex(highlightedIndex + 1);
      } else {
        onAnimateComplete();
        setHighlightedIndex(-1);
      }
    }
  }, highlightSpeed * 1000 || 50000);

  useKey(
    () => animating && !autoAdvance,
    () => {
      if (highlightedIndex < words.length - 1) {
        setHighlightedIndex(highlightedIndex + 1);
      } else {
        onAnimateComplete();
        setHighlightedIndex(-1);
      }
    },
    { event: "keydown" }
  );

  useEffect(() => {
    if (animating && highlightedIndex === -1) {
      setHighlightedIndex(0);
    }
  }, [animating, highlightedIndex]);

  return (
    <h1 style={{ color: textColor }}>
      {words.map((word, idx) => (
        <Word
          word={word}
          key={idx}
          highlightColor={highlightColor}
          isHighlighted={animating && highlightedIndex === idx}
        />
      ))}
    </h1>
  );
}
