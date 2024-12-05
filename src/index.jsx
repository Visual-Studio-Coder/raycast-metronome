import { List, showToast, Toast, popToRoot, environment, ActionPanel, Action, Icon } from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import sound from "sound-play";

export default function Command(props) {
  const { bpm, group } = props.arguments;
  const [taps, setTaps] = useState(0);
  const groupPositionRef = useRef(1);
  const [isRunning, setIsRunning] = useState(true);

  const handleStartStop = () => {
    if (isRunning) stopMetronome();
    else startMetronome();
  };

  const stopMetronome = () => {
    setIsRunning(false);
    setTaps(0);
    groupPositionRef.current = 1;
  };

  const startMetronome = () => {
    setIsRunning(true);
  };

  useEffect(() => {
    let timer = null;
    const interval = 60000 / Number(bpm);

    function handleClick() {
      const clickSound = groupPositionRef.current === 1 ? "metronome-click.wav" : "metronome-click_lower.wav";
      const soundPath = `${environment.assetsPath}/sfx/${clickSound}`;

      sound.play(soundPath).catch((error) => {
        console.error(`Failed to play sound: ${soundPath}`, error);
      });

      groupPositionRef.current = groupPositionRef.current === Number(group) ? 1 : groupPositionRef.current + 1;
      setTaps((previousTaps) => previousTaps + 1);
    }

    if (isRunning) timer = setInterval(handleClick, interval);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [bpm, group, isRunning]);

  if (
    Number.isInteger(Number(bpm)) &&
    Number(bpm) > 0 &&
    Number(bpm) < 700 &&
    Number.isInteger(Number(group)) &&
    Number(group) > 0 &&
    Number(group) < 700
  ) {
    const description = isRunning ? "Click ↵ to pause" : "Click ↵ to play";
    return (
      <List searchBarPlaceholder="" searchText="">
        <List.EmptyView
          title={`BPM: ${bpm} | Accents: Per ${group} Clicks | Clicks: ${taps}`}
          description={description}
          icon={taps % 2 === 0 ? "metronome-left.png" : "metronome-right.png"}
          actions={
            <ActionPanel>
              <Action
                title={isRunning ? "Pause" : "Play"}
                icon={isRunning ? Icon.Pause : Icon.Play}
                onAction={handleStartStop}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  } else {
    showToast({
      style: Toast.Style.Failure,
      title: "Invalid Inputs",
      message: "Inputs must be positive integers below 700",
    });
    popToRoot();
    return null;
  }
}
