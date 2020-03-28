import React, { useEffect, useState } from "react";
import { EuiText } from "@elastic/eui";
import { Sentence } from "./Sentence";

export function Story({
  storyText,
  animating,
  autoAdvance,
  highlightSpeed,
  highlightColor,
  textColor,
  textSize,
  onStoryAnimateComplete,
}) {
  const sentences = storyText.split("\n");

  const [animatingIndex, setAnimatingIndex] = useState(-1);

  const onAnimateComplete = (index) => () => {
    if (animating) {
      if (index === sentences.length - 1) {
        onStoryAnimateComplete();
      } else {
        setAnimatingIndex(index + 1);
      }
    }
  };

  useEffect(() => {
    if (animating && animatingIndex < 0) {
      setAnimatingIndex(0);
    }
    if (!animating) {
      setAnimatingIndex(-1);
    }
  }, [animating, animatingIndex]);

  return (
    <EuiText size={textSize}>
      {sentences.map((sentence, index) => (
        <Sentence
          animating={index === animatingIndex}
          autoAdvance={autoAdvance}
          onAnimateComplete={onAnimateComplete(index)}
          textColor={textColor}
          highlightColor={highlightColor}
          highlightSpeed={highlightSpeed}
          sentence={sentence}
          key={index}
        />
      ))}
    </EuiText>
  );
}
