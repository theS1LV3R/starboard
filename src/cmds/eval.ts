import Command from "../util/command";
import { clean, parseCodeblock } from "../util/misc";
import { inspect } from "util";

export default new Command(
  {
    name: "eval",
    aliases: ["basic_eval", "basiceval"],
    permissions: {
      bot: ["EMBED_LINKS", "SEND_MESSAGES"]
    },
    level: 3,
    disabled: false,
  },
  async (client, message, args) => {
    const startTime: number = Date.now();
    let code = parseCodeblock(args.join(" "));
    try {
      let evaled = await eval(code);

      if (typeof evaled !== "string") {
        evaled = inspect(evaled);
      }

      /* This checks if the input and output are over 1024 characters long
            (1016 characters with codeblock), and if so, it replaces them,
            in order to prevent the embed from raising an uncaught exception. */
      if (code.length > 1016) {
        code =
          '"The input cannot be displayed as it is longer than 1024 characters."';
      }
      if (evaled.length > 1016) {
        console.log("Eval Output:\n", clean(evaled));
        evaled =
          '"The output cannot be displayed as it is longer than 1024 characters. Please check the console."';
      }

      const embed = client
        .defaultEmbed()
        .setColor("GREEN")
        .setTitle("Evaluation Successful")
        .addFields(
          { name: "📥 Input", value: `\`\`\`js\n${code}\`\`\`` },
          { name: "📤 Output", value: `\`\`\`js\n${clean(evaled)}\`\`\`` }
        )
        .setTimestamp()
        .setFooter(
          `Execution time: ${Math.round(Date.now() - startTime)}ms`,
          client.user.displayAvatarURL({ format: "png" })
        );

      message.channel.send(embed);
    } catch (error) {
      console.error("Eval:", error);
      const embed = client
        .defaultEmbed()
        .setColor("RED")
        .setTitle("Evaluation Error")
        .addFields(
          { name: "📥 Input", value: `\`\`\`js\n${code}\`\`\`` },
          {
            name: "❌ Error message",
            value: `\`\`\`js\n${error.message}\`\`\``,
          }
        )
        .setTimestamp()
        .setFooter(
          `Execution time: ${Math.round(Date.now() - startTime)}ms`,
          client.user.displayAvatarURL({ format: "png" })
        );
      message.channel.send(embed);
    }
  }
);
