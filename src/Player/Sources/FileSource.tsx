import React from 'react';
import { SourceComponent } from './Source';

class FileSource extends SourceComponent {

  /**
   * FileSource is currently unfinished/can't play anything yet!
   */
  static canPlay = (src: string) => false;

  load(src: string): void {
    throw new Error("Method not implemented.");
  }
  play(): void {
    throw new Error("Method not implemented.");
  }
  pause(): void {
    throw new Error("Method not implemented.");
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  seekTo(amount: number): void {
    throw new Error("Method not implemented.");
  }

  render() {
    return (
      <div>Hi me FileSource. Who u?</div>
    );
  }
}

export default FileSource;