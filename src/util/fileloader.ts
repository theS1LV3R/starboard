import { join, basename } from "path";
import { promisify } from "util";
import { readdir, stat, Stats } from "fs-extra";

import Client from "./Client";
import Command from "./Command";
import chalk from "chalk";

/**
 * Recursively load files
 * @param {string} dir The root dir
 * @param {Array<string>} allFiles all the files
 */
async function fileloader(
  dir: string,
  checkShouldIgnore?: (uri: string, stats: Stats) => boolean,
  concurrency = 100
): Promise<string[]> {
  const collected: string[] = [];
  const queue = [dir];
  const visit = async (file: string) => {
    const stats = await stat(file);
    if (checkShouldIgnore?.(file, stats)) return;
    if (stats.isDirectory()) {
      queue.push(...(await readdir(file)).map((f) => join(file, f)));
      return;
    }
    collected.push(file);
  };
  while (queue.length) {
    await Promise.all(queue.splice(0, concurrency).map(visit));
  }
  return collected;
}

/**
 * Load events from the events dir
 * @param {Client} client The Discord client
 * @param {string} eventsDir The dir containing the event files
 */
async function loadEvents(client: Client, eventsDir: string): Promise<void> {
  const files = await fileloader(eventsDir);
  for await (const file of files) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;

    const event = await require(file);
    const eventName = basename(file).split(".")[0];

    client.on(eventName as any, event.bind(null, client));
    console.log(chalk`{green [{bold E}] Loaded {bold ${eventName}}}`);
  }
}

/**
 * Load all of the commands recursively
 * @param {Client} client The Discord client
 * @param {string} commandsRootDir The root commands directory
 */
async function loadCommands(
  client: Client,
  commandsRootDir: string
): Promise<void> {
  const files = await fileloader(commandsRootDir);
  for await (const file of files) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;

    const command: Command = (await require(file)).default;
    if (command.constructor.name !== "Command") continue;

    if (!command.config.name || command.config.skipLoading) {
      console.error(
        chalk`{yellow [{bold C}] Command file {bold ${basename(
          file
        )}} was not loaded.}`
      );
      continue;
    }

    command.config.filePath = file;
    client.commands.set(command.config.name, command);
    console.log(
      chalk`{magenta [{bold C}] Loaded {bold ${command.config.name}}}`
    );
  }
}

export { fileloader as default, loadEvents, loadCommands };
