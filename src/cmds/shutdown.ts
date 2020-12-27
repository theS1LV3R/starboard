import Command from "../util/command";
import chalk from "chalk";
import { confirmation } from "../util/misc";

export default new Command(
  {
    name: "shutdown",
    aliases: ["stop"],
    permissions: { bot: ["SEND_MESSAGES"] },
    help: {
      shortDescription: "Stops the bot",
      description: "Stops the bot, and exits the process.",
      category: "bot admin",
    },
    level: 3,
  },
  async (client, message) => {
    const question = ":warning: Are you sure you would like to stop the bot?";
    const yes = "Shutting down...";
    const no = "Shutdown cancelled.";

    if (
      !(await confirmation(message, question, {
        confirmMessage: yes,
        denyMessage: no,
      }))
    )
      return;
    console.log(
      chalk`{red [{bold I}] {bold Shutdown} command used by {bold ${
        message.author.tag
      }} on ${new Date()}}`
    );
    client.destroy();
    console.log("Client destroyed, exiting process...");
    process.exit(0);
  }
);
