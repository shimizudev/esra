/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CommandContext, OptionsRecord } from "seyfert";
import { Embed } from "seyfert";
import { otakuGif, type Reaction } from "src/lib/otakugif";
import { chooseFrom } from "src/utils/random";

export function getDynamicMessage(reaction: Reaction, sender: string, receiver: string): string {
    const messages: Record<Reaction, Array<string>> = {
        kiss: [
            `${sender} blows a sweet kiss to ${receiver} 💋`,
            `Mwah! 😘 ${sender} sends a lovely kiss to ${receiver}!`,
            `${sender} kisses ${receiver} softly! 💖`
        ],
        hug: [
            `${sender} wraps ${receiver} in a warm hug 🤗`,
            `Aww! ${sender} gives ${receiver} a tight, cozy hug 🥰`,
            `${receiver} gets a big hug from ${sender} 💕`
        ],
        cuddle: [
            `${sender} cuddles up next to ${receiver}! 🐻`,
            `So soft! ${sender} snuggles in for a cuddle with ${receiver} 💤`,
            `${sender} pulls ${receiver} into a comfy cuddle! ☁️`
        ],
        lick: [
            `${sender} playfully licks ${receiver}'s cheek 😜`,
            `Yikes! ${sender} gives ${receiver} a sneaky lick 👅`,
            `Eeek! ${sender} licks ${receiver} with a mischievous grin! 😝`
        ],
        airkiss: [
            `${sender} sends ${receiver} a cute airkiss 💋`,
            `A flying kiss from ${sender} flutters over to ${receiver}! 😘`,
            `Swoosh! ${sender} blows ${receiver} a soft airkiss! 🌸`
        ],
        angrystare: [
            `${sender} gives ${receiver} an angry stare 😡`,
            `Uh-oh! ${sender} is glaring at ${receiver} with fury 😠`,
            `${sender} is not happy and glares intensely at ${receiver}! 🔥`
        ],
        confused: [
            `${sender} looks confused at ${receiver}... 🤨`,
            `Huh? ${sender} tilts their head, looking puzzled at ${receiver} 😕`,
            `What? ${sender} scratches their head in confusion at ${receiver}! 🤔`
        ],
        blush: [
            `${sender} blushes deeply at ${receiver}! 😳`,
            `Oh no! ${sender} is blushing so hard because of ${receiver}! 😳`,
            `${sender} can't hide their rosy cheeks when looking at ${receiver}! 😖`
        ],
        bleh: [
            `${sender} sticks out their tongue at ${receiver}! 😛`,
            `Bleh! ${sender} teases ${receiver} with a playful face 😜`,
            `${sender} goes 'bleh' and pokes their tongue out at ${receiver} 😋`
        ],
        punch: [
            `Watch out! ${sender} throws a punch at ${receiver}! 👊`,
            `${sender} delivers a playful punch to ${receiver}! 💥`,
            `Bam! ${sender} lightly punches ${receiver}! 💢`
        ],
        bite: [],
        brofist: [],
        celebrate: [],
        cheers: [],
        clap: [],
        cool: [],
        cry: [],
        dance: [],
        drool: [],
        evillaugh: [],
        facepalm: [],
        handhold: [],
        happy: [],
        headbang: [],
        huh: [],
        laugh: [],
        love: [],
        mad: [],
        nervous: [],
        no: [],
        nom: [],
        nosebleed: [],
        nuzzle: [],
        nyah: [],
        pat: [],
        peek: [],
        pinch: [],
        poke: [],
        pout: [],
        roll: [],
        run: [],
        sad: [],
        scared: [],
        shout: [],
        shrug: [],
        shy: [],
        sigh: [],
        sip: [],
        slap: [],
        sleep: [],
        slowclap: [],
        smack: [],
        smile: [],
        smug: [],
        sneeze: [],
        sorry: [],
        stare: [],
        stop: [],
        surprised: [],
        sweat: [],
        thumbsup: [],
        tickle: [],
        tired: [],
        wave: [],
        wink: [],
        woah: [],
        yawn: [],
        yay: [],
        yes: []
    };

    const selectedMessages = messages[reaction];
    return chooseFrom(...selectedMessages);
}

export async function handleReaction<U extends OptionsRecord>(ctx: CommandContext<U>, reaction: Reaction): Promise<void> {
    const sender = ctx.member?.user.username;
    // @ts-expect-error: I dunno why this is needed
    const receiver = ctx.options.target?.user.username ?? "someone";

    try {
        const gif = await otakuGif.fetchGif(reaction);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const message = getDynamicMessage(reaction, sender as string, receiver);
        const embed = new Embed()
            .setTitle(message)
            .setImage(gif.url);

        await ctx.write({ embeds: [embed] });
    } catch (error) {
        await ctx.write({ content: "Failed to fetch reaction gif." });
    }
}

