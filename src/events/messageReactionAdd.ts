import Client from "../util/Client";
import { MessageReaction, User } from "discord.js";

export = (_client: Client, r: MessageReaction, u: User) => {
  if (u.bot) return;

  // const sb = r.message.guild.starboards[0]

  // const emoji = sb.emoji

  // // the emoji is not a starboard emoji
  // if (
  //   r.emoji.id !== emoji &&
  //   r.emoji.name !== emoji
  // ) return
  // console.log('starboard!')
};
