export interface StreamingLinks {
  spotify: string
  apple: string
  deezer: string
}

export interface Album {
  title: string
  year: string
  cover: string
  youtubeId: string
}

export interface PopularTrack {
  title: string
  streams: string
  time: string
  youtubeId: string
}

export interface Artist {
  id?: string
  name: string
  genre: string
  banner: string
  profile: string
  bio: string
  listeners: string
  streaming: StreamingLinks
  albums: Album[]
  popular: PopularTrack[]
}

export interface Slide {
  id: number
  image: string
  title: string
  youtubeId: string
}

export interface Track {
  id: number
  title: string
  artist: string
  image: string
  audioUrl: string
  durationText: string
  youtubeId: string
}

export interface Release {
  id?: string
  title: string
  artist: string
  cover_url: string
  audio_url: string
  duration: string
  youtube_id?: string
  created_at?: string
  artist_id?: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}
