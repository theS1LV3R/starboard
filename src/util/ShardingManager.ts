import { ShardingManager } from "discord.js";

export default class extends ShardingManager {
  constructor(file: string, options: any) {
    super(file, options);
  }
}
