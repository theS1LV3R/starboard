import Client from "@util/Client";

import { Structures, Collection, Snowflake, Guild } from "discord.js";

import { Starboard as SB, GuildDocument } from "@types";

import { Starboard } from "./Starboard";

Structures.extend("Guild", (G) => {
  return class extends G {
    _client: Client;

    constructor(client: Client, data: any) {
      super(client, data);
      this._client = client;
    }

    get db(): Promise<GuildDocument> {
      return this._client.db.guilds.findOne({ id: this.id });
    }

    async starboards(): Promise<Collection<Snowflake, SB>> {
      const temp: Collection<Snowflake, SB> = new Collection();
      const db = await this.db;

      for (const sb of db.starboards || []) {
        const s = new Starboard((this as unknown) as Guild, sb);
        temp.set(s.channel.id, s);
      }

      return temp;
    }
  };
});
