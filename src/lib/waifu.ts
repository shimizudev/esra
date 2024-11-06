import process from "node:process";
type AnimeGifEndpoints =
    | "angry"
    | "baka"
    | "bite"
    | "blush"
    | "bonk"
    | "bored"
    | "bully"
    | "bye"
    | "chase"
    | "cheer"
    | "cringe"
    | "cry"
    | "cuddle"
    | "dab"
    | "dance"
    | "die"
    | "disgust"
    | "facepalm"
    | "feed"
    | "glomp"
    | "happy"
    | "hi"
    | "highfive"
    | "hold"
    | "hug"
    | "kick"
    | "kill"
    | "kiss"
    | "laugh"
    | "lick"
    | "love"
    | "lurk"
    | "midfing"
    | "nervous"
    | "nom"
    | "nope"
    | "nuzzle"
    | "panic"
    | "pat"
    | "peck"
    | "poke"
    | "pout"
    | "punch"
    | "run"
    | "sad"
    | "shoot"
    | "shrug"
    | "sip"
    | "slap"
    | "sleepy"
    | "smile"
    | "smug"
    | "stab"
    | "stare"
    | "suicide"
    | "tease"
    | "think"
    | "thumbsup"
    | "tickle"
    | "triggered"
    | "wag"
    | "wave"
    | "wink"
    | "yes";

export default class WaifuIt {
    private readonly baseUrl: string;
    private readonly token: string;

    public constructor(token: string) {
        this.baseUrl = "https://waifu.it/api/v4";
        this.token = token;
    }

    private async request<T>(endpoint: string): Promise<T> {
        const url = `${this.baseUrl}/${endpoint}`;
        const headers = {
            Authorization: this.token
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok)
                throw new Error(`Request failed with status ${response.status}`);

            return await response.json() as T;
        } catch (error) {
            console.error("Error fetching data from Waifu.it:", error);
            throw error;
        }
    }

    public async getInteraction(action: AnimeGifEndpoints): Promise<{ url: string }> {
        const data = await this.request<{ url: string }>(action);

        return data;
    }

    public async getWaifu(): Promise<unknown> {
        const data = await this.request<unknown>("waifu");

        return data;
    }

    public async getQuote(): Promise<unknown> {
        const data = await this.request<unknown>("quote");
        return data;
    }
}

export const waifu = new WaifuIt(process.env.WAIFU_IT_TOKEN ? process.env.WAIFU_IT_TOKEN : "");
