import { PureComponent } from "react";

export interface SourceProps {
  src: string;
  playing: boolean;

  onReady(): void;
  onPlay(): void;
  onPause(): void;
  onBuffer(): void;
  onEnded(): void;
  onError(): void;
}

export abstract class SourceComponent extends PureComponent<SourceProps> {

  static defaultProps: Pick<SourceProps, "onReady" | "onPlay" | "onPause" | "onBuffer" | "onEnded" | "onError"> = {
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

  /**
   * Seeks the source
   * @param amount The amount to seek
   */
  abstract seekTo(amount: number): void;
}