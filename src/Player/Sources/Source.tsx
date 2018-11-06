import { PureComponent } from "react";

export interface SourceProps {
  src: string;
  playing: boolean;
  volume: number;
  mute: boolean;

  onReady(): void;
  onPlay(): void;
  onPause(): void;
  onBuffer(): void;
  onEnded(): void;
  onError(): void;
}

export abstract class SourceComponent extends PureComponent<SourceProps> {

  static defaultProps: Pick<SourceProps, "volume" | "mute" | "onReady" | "onPlay" | "onPause" | "onBuffer" | "onEnded" | "onError"> = {
    volume: 100,
    mute: false,
    onReady: () => {},
    onPlay: () => {},
    onPause: () => {},
    onBuffer: () => {},
    onEnded: () => {},
    onError: () => {}
  }

  /**
   * Loads the source
   * @param src The source to load
   */
  abstract load(): void;

  /**
   * Plays the source
   */
  abstract play(): void;

  /**
   * Pauses the source
   */
  abstract pause(): void;

  /**
   * Stops the source
   */
  abstract stop(): void;

  abstract setVolume(volume: number): void;

  /**
   * Seeks the source
   * @param amount The amount to seek
   */
  abstract seekTo(amount: number): void;
}