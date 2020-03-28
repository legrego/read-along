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
  EuiFilePicker,
} from "@elastic/eui";
import { useColorPickerState } from "@elastic/eui/lib/services";
import { useLocalStorage } from "react-use";
import { EuiSwitch } from "@elastic/eui";
import { EuiImage } from "@elastic/eui";
import { EuiButtonIcon } from "@elastic/eui";

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
  const [autoAdvance, setAutoAdvance] = useState(false);

  const [storyText, setStoryText] = useLocalStorage(
    "storyText",
    "Hey there, how are you?"
  );

  const [storyImage, setStoryImage] = useLocalStorage("storyImage");

  const animateSentence = () => {
    setIsAnimating(true);
  };

  const onUploadFile = (files) => {
    if (files == null) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => setStoryImage(reader.result);
    reader.readAsDataURL(file);
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
              </EuiFlexGroup>
              <EuiFlexGroup>
                <EuiFlexItem grow={false}>
                  <EuiFormRow label="" hasEmptyLabelSpace>
                    <EuiSwitch
                      label="Auto-advance highlighted word"
                      checked={autoAdvance}
                      onChange={(e) => setAutoAdvance(e.target.checked)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Highlight delay (seconds)">
                    <EuiRange
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={highlightSpeed}
                      onChange={(e) => setHighlightSpeed(e.target.value)}
                      showLabels
                      showValue
                      disabled={!autoAdvance}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>

            <EuiSpacer />

            {isEditing && (
              <EuiPanel>
                <EuiFlexGroup>
                  <EuiFlexItem grow={2}>
                    <EuiTextArea
                      onChange={(e) => setStoryText(e.target.value)}
                      value={storyText}
                    />
                  </EuiFlexItem>
                  <EuiFlexItem grow={1}>
                    {storyImage && (
                      <>
                        <EuiImage src={storyImage} size="m" />
                        <EuiSpacer size="s" />
                        <EuiButton
                          iconType="trash"
                          color="danger"
                          onClick={() => setStoryImage("")}
                          compressed
                        >
                          Remove image
                        </EuiButton>{" "}
                      </>
                    )}
                    {!storyImage && (
                      <EuiFilePicker
                        initialPromptText={"Select an image"}
                        onChange={onUploadFile}
                        accept={
                          "image/svg+xml, image/jpeg, image/png, image/gif"
                        }
                      />
                    )}
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPanel>
            )}
            {!isEditing && (
              <EuiPanel>
                <EuiFlexGroup>
                  <EuiFlexItem grow={2}>
                    <Story
                      textSize={textSize}
                      textColor={textColor}
                      highlightColor={highlightColor}
                      storyText={storyText}
                      animating={isAnimating}
                      autoAdvance={autoAdvance}
                      highlightSpeed={autoAdvance ? highlightSpeed : 0}
                      onStoryAnimateComplete={() => setIsAnimating(false)}
                    />
                  </EuiFlexItem>
                  {storyImage && (
                    <EuiFlexItem grow={1}>
                      <EuiImage src={storyImage} size="m" />
                    </EuiFlexItem>
                  )}
                </EuiFlexGroup>
              </EuiPanel>
            )}

            <EuiSpacer />

            <EuiFlexGroup direction="row">
              <EuiFlexItem grow={false}>
                {isAnimating ? (
                  <EuiButton onClick={() => setIsAnimating(false)}>
                    Stop
                  </EuiButton>
                ) : (
                  <EuiButton onClick={animateSentence} isDisabled={isEditing}>
                    Start reading
                  </EuiButton>
                )}
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
