import React, { useState } from "react";
import "@elastic/eui/dist/eui_theme_light.css";
import "./App.css";
import { EuiPage } from "@elastic/eui";
import {
  EuiButton,
  EuiFormRow,
  EuiButtonGroup,
  EuiPageBody,
  EuiPanel,
  EuiPageContentBody,
  EuiSpacer,
} from "@elastic/eui";
import { Story } from "./Story";
import {
  EuiColorPicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiRange,
  EuiTextArea,
} from "@elastic/eui";
import { useColorPickerState } from "@elastic/eui/lib/services";
import { useLocalStorage } from "react-use";

function App() {
  const [textSize, setTextSize] = useState("m");
  const [textColor, setTextColor, textColorErrors] = useColorPickerState(
    "#333333"
  );
  const [
    highlightColor,
    setHighlightColor,
    highlightColorErrors,
  ] = useColorPickerState("#D36086");
  const [highlightSpeed, setHighlightSpeed] = useState(0.25);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [storyText, setStoryText] = useLocalStorage(
    "storyText",
    "Hey there, how are you?"
  );

  const animateSentence = () => {
    setIsAnimating(true);
  };
  return (
    <div className="App">
      <EuiPage>
        <EuiPageBody>
          <EuiPageContentBody>
            <EuiPanel>
              <EuiFlexGroup direction="row">
                <EuiFlexItem>
                  <EuiFormRow label="Text size">
                    <EuiButtonGroup
                      buttonSize={"s"}
                      idSelected={textSize}
                      options={[
                        { id: "xs", label: "small" },
                        { id: "s", label: "medium" },
                        { id: "m", label: "large" },
                      ]}
                      onChange={(id) => setTextSize(id)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow
                    label="Text color"
                    isInvalid={!!textColorErrors}
                    error={textColorErrors}
                  >
                    <EuiColorPicker
                      compressed
                      color={textColor}
                      onChange={setTextColor}
                      isInvalid={!!textColorErrors}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow
                    label="Highlight color"
                    isInvalid={!!highlightColorErrors}
                    error={highlightColorErrors}
                  >
                    <EuiColorPicker
                      compressed
                      color={highlightColor}
                      onChange={setHighlightColor}
                      isInvalid={!!highlightColorErrors}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Highlight delay (seconds)">
                    <EuiRange
                      min={0}
                      max={2}
                      step={0.25}
                      value={highlightSpeed}
                      onChange={(e) => setHighlightSpeed(e.target.value)}
                      showLabels
                      showValue
                    />
                  </EuiFormRow>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>

            <EuiSpacer />

            {isEditing && (
              <EuiPanel>
                <EuiTextArea
                  onChange={(e) => setStoryText(e.target.value)}
                  value={storyText}
                />
              </EuiPanel>
            )}
            {!isEditing && (
              <EuiPanel>
                <Story
                  textSize={textSize}
                  textColor={textColor}
                  highlightColor={highlightColor}
                  storyText={storyText}
                  animating={isAnimating}
                  highlightSpeed={highlightSpeed}
                  onStoryAnimateComplete={() => setIsAnimating(false)}
                />
              </EuiPanel>
            )}

            <EuiSpacer />

            <EuiFlexGroup direction="row">
              <EuiFlexItem grow={false}>
                <EuiButton
                  onClick={animateSentence}
                  isDisabled={isEditing}
                  isLoading={isAnimating}
                >
                  Start reading
                </EuiButton>
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                {isEditing ? (
                  <EuiButton onClick={() => setIsEditing(false)}>
                    Save
                  </EuiButton>
                ) : (
                  <EuiButton
                    onClick={() => setIsEditing(true)}
                    isDisabled={isAnimating}
                  >
                    Edit story
                  </EuiButton>
                )}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageContentBody>
        </EuiPageBody>
      </EuiPage>
    </div>
  );
}

export default App;
