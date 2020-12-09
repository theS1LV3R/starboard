/* eslint @typescript-eslint/no-useless-constructor: 'off' */
import "./Structures/guild";
import {
  Client,
  ClientOptions,
  Collection,
  Snowflake,
  MessageEmbed,
  Team,
  User,
} from "discord.js";
import { resolve } from "path";

import Command from "./Command";
import { Database } from "./Database";
import { constants } from "../setup";
import { loadEvents, loadCommands } from "./fileloader";

export default class extends Client {
  /**
   * The commands collection
   * Map<string, command>
   */
  commands: Collection<string, Command> = new Collection();
  /** The main database */
  db: any;
  /** Bot administrators */
  admins: Set<Snowflake> = new Set();
  /** Constants */
  constants = constants;

  constructor(options: ClientOptions) {
    super(options);
    this.db = new Database(options.databases[0]);

    if (options.admins) {
      for (const admin of options.admins) {
        this.admins.add(admin);
      }
    }
    loadEvents(this, resolve(__dirname, "../events"));
    loadCommands(this, resolve(__dirname, "../cmds"));
  }

  /**
   * Default embed
   * @param {MessageEmbed} [embed] Discord.js's MessageEmbed takes an embed as a param
   */
  defaultEmbed(embed?: MessageEmbed): MessageEmbed {
    return new MessageEmbed(embed).setColor(this.constants.colors.default);
  }

  /**
   * Fetch team members from the client's dev portal team
   * @returns {Promise<User[]>}
   * @example
   * const teamMembers: User[] = await client.fetchTeamMembers()
   */
  async fetchTeamMembers(): Promise<User[]> {
    const { owner } = await super.fetchApplication();

    if (owner instanceof Team) {
      return owner.members.map((t) => t.user);
    }
    if (owner instanceof User) {
      return [owner];
    }
    throw new Error("Error fetching team members");
  }
}
