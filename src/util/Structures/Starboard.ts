import {
  Starboard as SB,
  StarboardRaw,
  StarboardMessage as SM,
  StarboardMessageRaw,
} from "../../types";

import { StarboardMessage } from "./StarboardMessage";

import {
  TextChannel,
  GuildEmoji,
  Snowflake,
  Collection,
  Guild,
} from "discord.js";

export class Starboard implements SB {
  channel: TextChannel;
  emoji: GuildEmoji | string;
  messages: Collection<Snowflake, SM> = new Collection();
  excludeChannels: Collection<Snowflake, TextChannel> = new Collection();
  selfStar: boolean;
  threshold: number;
  created: Date;
  saved: false;

  constructor(public guild: Guild, public ops: StarboardRaw) {
    this.assign();
    console.log("new starboard");
  }

  private assign(): void {
    console.log("does this run");
    this.channel = this.guild.channels.cache.find(
      ({ id, type }) => id === this.ops.channel && type === "text"
    ) as TextChannel;
    this.emoji = this.guild.emojis.cache.get(this.ops.emoji) || this.ops.emoji;
    this.messages = new Collection();
    this.excludeChannels = new Collection();
    this.threshold = this.ops.threshold;
    this.selfStar = this.ops.selfStar;
    this.created = this.ops.created;

    for (const msg of this.ops.messages || []) {
      const m = new StarboardMessage(this.guild, this, msg);
      this.messages.set(m.msg.id, m);
    }

    for (const chan of this.ops.excludeChannels) {
      const ch = this.guild.channels.cache.find(
        ({ id, type }) => id === chan && type === "text"
      ) as TextChannel;
      if (ch.type !== "text") continue;
      this.excludeChannels.set(ch.id, ch);
    }
  }

  addMsg(msg: StarboardMessageRaw): void {
    const m = new StarboardMessage(this.guild, this, msg);
    this.messages.set(m.msg.id, m);

    this.guild.client.db.addStarboardMsg(m);
  }

  save(): void {
    this.guild.client.db.addStarboard(this.guild.id, this).then(console.log);
  }

  toRaw(): StarboardRaw {
    return {
      channel: this.channel.id,
      emoji:
        this.emoji instanceof GuildEmoji
          ? this.emoji.id || this.emoji.name
          : this.emoji,
      excludeChannels: this.excludeChannels.map((e) => e.id),
      selfStar: this.selfStar,
      threshold: this.threshold,
      messages: this.messages.map((m) => m.toRaw()),
      created: this.created,
    };
  }
}
