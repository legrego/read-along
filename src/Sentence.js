import React, { useEffect, useRef, useState } from "react";
import { Word } from "./Word";

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
  onAnimateComplete,
  textColor,
  highlightColor,
  highlightSpeed,
}) {
  const words = useRef(sentence.split(/\s/g));
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [isAnimating, setIsAnimating] = useState(animating);
  useEffect(() => {
    setIsAnimating(animating);
  }, [animating]);

  useInterval(() => {
    if (isAnimating) {
      if (highlightedIndex < words.current.length - 1) {
        setHighlightedIndex(highlightedIndex + 1);
      } else {
        setIsAnimating(false);
        onAnimateComplete();
        setHighlightedIndex(-1);
      }
    }
  }, highlightSpeed * 1000);

  return (
    <h1 style={{ color: textColor }}>
      {words.current.map((word, idx) => (
        <Word
          word={word}
          key={idx}
          highlightColor={highlightColor}
          isHighlighted={highlightedIndex === idx}
        />
      ))}
    </h1>
  );
}
