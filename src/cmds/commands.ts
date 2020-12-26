import Command from "../util/command";

export default new Command(
  {
    name: "commands",
    aliases: ["listcommands", "commandlist"],
    permissions: {
      bot: ["EMBED_LINKS", "SEND_MESSAGES"]
    },
    help: {
      description: "Get a list of commands",
      category: "other",
    },
  },
  async (client, message) => {
    const embed = client
      .defaultEmbed()
      .setTitle("Here is a list of my commands:")
      .setDescription(client.commands.map((c) => c.config.name).join("\n"));
    return await message.channel.send(embed);
  }
);
