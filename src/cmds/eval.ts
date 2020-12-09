import Command from "../util/command";
import { runInThisContext } from "vm";
import { inspect } from "util";

export default new Command(
  {
    name: "eval",
    aliases: ["basic_eval", "basiceval"],
    level: 3,
    disabled: false,
  },
  async (_client, message, args) => {
    if (!args[0])
      return await message.channel.send(":x: You must include code to execute");

    try {
      const result = await runInThisContext(args.join(" "), {
        filename: message.author.id,
      });

      message.channel.send(
        (typeof result === "string" ? result : inspect(result)).substring(
          0,
          2000
        ),
        { code: "js" }
      );
    } catch (err) {
      message.channel.send(err, { code: "js" });
    }
  }
);
