export interface Track {
  id: string | number;
  title: string;
  artist: string;
  image: string;
  audioUrl?: string;
  durationText: string;
  youtubeId?: string | null;
}
