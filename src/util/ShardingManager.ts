import { ShardingManager, ShardingManagerMode } from "discord.js";

export default class extends ShardingManager {
  constructor(file: string, options: ShardingManagerOptions) {
    super(file, options);
  }
}

export interface ShardingManagerOptions {
  totalShards?: number | "auto";
  shardList?: number[] | "auto";
  mode?: ShardingManagerMode;
  respawn?: boolean;
  shardArgs?: string[];
  token?: string;
  execArgv?: string[];
}
