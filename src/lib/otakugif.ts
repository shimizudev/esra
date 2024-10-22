type GifFormat = "gif" | "webp" | "avif";
export type Reaction =
  | "airkiss"
  | "angrystare"
  | "bite"
  | "bleh"
  | "blush"
  | "brofist"
  | "celebrate"
  | "cheers"
  | "clap"
  | "confused"
  | "cool"
  | "cry"
  | "cuddle"
  | "dance"
  | "drool"
  | "evillaugh"
  | "facepalm"
  | "handhold"
  | "happy"
  | "headbang"
  | "hug"
  | "huh"
  | "kiss"
  | "laugh"
  | "lick"
  | "love"
  | "mad"
  | "nervous"
  | "no"
  | "nom"
  | "nosebleed"
  | "nuzzle"
  | "nyah"
  | "pat"
  | "peek"
  | "pinch"
  | "poke"
  | "pout"
  | "punch"
  | "roll"
  | "run"
  | "sad"
  | "scared"
  | "shout"
  | "shrug"
  | "shy"
  | "sigh"
  | "sip"
  | "slap"
  | "sleep"
  | "slowclap"
  | "smack"
  | "smile"
  | "smug"
  | "sneeze"
  | "sorry"
  | "stare"
  | "stop"
  | "surprised"
  | "sweat"
  | "thumbsup"
  | "tickle"
  | "tired"
  | "wave"
  | "wink"
  | "woah"
  | "yawn"
  | "yay"
  | "yes";

interface GifResponse {
    url: string;
}

interface AllReactionsResponse {
    reactions: Array<Reaction>;
}

export default class OtakuGifs {
    private readonly baseUrl: string;

    public constructor() {
        this.baseUrl = "https://api.otakugifs.xyz/gif";
    }

    public async fetchGif(reaction: Reaction, format: GifFormat = "gif"): Promise<GifResponse> {
        const url = `${this.baseUrl}?reaction=${reaction}&format=${format}`;
        const response = await fetch(url);

        if (!response.ok)
            throw new Error("Failed to fetch the gif");

        return response.json() as Promise<GifResponse>;
    }

    public async fetchAllReactions(): Promise<AllReactionsResponse> {
        const url = `${this.baseUrl}/allreactions`;
        const response = await fetch(url);

        if (!response.ok)
            throw new Error("Failed to fetch reactions");

        return response.json() as Promise<AllReactionsResponse>;
    }
}

export const otakuGif = new OtakuGifs();
