import { default as FileSource } from './FileSource';
import { default as YoutubeSource } from './YoutubeSource';

const sources = [
  FileSource,
  YoutubeSource
];

export const findSource = (src: string) => {
  const foundSource = sources.find(source => source.canPlay(src));

  return foundSource;
}

export default sources;