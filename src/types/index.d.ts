import {
  PermissionResolvable,
  Message,
  Snowflake,
  Collection,
  GuildEmoji,
  MessageAttachment,
  GuildMember,
  GuildChannel,
  TextChannel,
} from "discord.js";
import DiscordClient from "../util/Client";
import { MongoClientOptions } from "mongodb";
import { Database } from "../util/Database";

export type Nullable<T> = T | null;

declare module "discord.js" {
  export interface Guild {
    /** The guild's database document */
    db?: Promise<GuildDocument>;
    /** Starboards */
    starboards(): Promise<Collection<Snowflake, Starboard>>;
  }

  export interface Client {
    db?: Database;
  }

  // not sure why i needed this, but tsc was complaining without it
  export interface GuildMember {
    client: DiscordClient;
  }

  export interface ClientOptions {
    /** Bot admins */
    admins?: Set<Snowflake>;
    /** Databases */
    databases: DatabaseOptions[];
    /** Cooldown upon starting the bot */
    startupCooldown?: number;
    /** Permissions the bot requires to function */
    permissions?: PermissionResolvable[];
  }
}

export type CommandCategories = "admin" | "owner" | "info" | string;

export interface CommandOptions {
  /** The command name */
  name: string;
  /** Command aliases */
  aliases?: string[];
  /** Disable the command */
  disabled?: boolean;
  /** Permission level required to use the command */
  level?: 0 | 1 | 2 | 3;
  /** Where the command file is located. Set automatically. */
  filePath?: string;
  /** Don't load the command */
  skipLoading?: boolean;
  /** Info for the help command */
  help?: {
    /** Short description of the command */
    shortDescription?: string;
    /** A description of the command */
    description?: string;
    /** What category the command is in */
    category?: CommandCategories;
    /** Hide the command from the help command */
    hidden?: boolean;
    /** Command usage */
    usage?: string;
  };
  permissions?: {
    user?: PermissionResolvable | PermissionResolvable[];
    bot?: PermissionResolvable | PermissionResolvable[];
  };
}

export type CommandFunction = (
  client?: DiscordClient,
  message?: Message,
  args?: string[],
  guild?: GuildDocument
) => Promise<any>;

export interface DatabaseOptions {
  name: string;
  url: string;
  options: MongoClientOptions;
}

export interface GuildDocument {
  id: Snowflake;
  starboards: StarboardRaw[];
  config: {
    prefix: string;
  };
}

export interface Starboard {
  // props
  channel: GuildChannel;
  emoji: GuildEmoji | string;
  messages: Collection<Snowflake, StarboardMessage>;
  excludeChannels: Collection<Snowflake, GuildChannel>;
  selfStar: boolean;
  threshold: number;
  created: Date;
  saved: boolean;

  // methods
  toRaw(): StarboardRaw;
  addMsg(arg0: StarboardMessageRaw): void;
}

export interface StarboardRaw {
  channel: Snowflake;
  emoji: string;
  excludeChannels: Snowflake[];
  selfStar: boolean;
  threshold: number;
  messages?: StarboardMessageRaw[];
  created: Date;
}

export interface StarboardMessage {
  // props
  msg: Message; // chat msg
  sbMsg: Nullable<Message>; // starboard msg
  channel: TextChannel;
  attachments: MessageAttachment[];
  author: GuildMember;
  date: Date;
  count: number;
  starredAt: Date;

  // methods
  send(): Promise<Message>;
  updateCount(arg0: number): Promise<void>;
  toRaw(): StarboardMessageRaw;
}

export interface StarboardMessageRaw {
  content: string;
  msg: Snowflake;
  sbMsg: Nullable<Snowflake>;
  channel: Snowflake;
  attachments: Nullable<string[]>;
  author: Snowflake;
  date: Date;
  count: number;
  starredAt: Date;
}
