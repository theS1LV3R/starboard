import Command from "../util/command";

export default new Command(
  {
    name: "ping",
    aliases: ["hello"],
    permissions: { bot: "SEND_MESSAGES" },
    help: {
      shortDescription: "Get current bot delay",
      description:
        "Gets the current bot delay. Useful for checking for slowness or discord API errors.",
      category: "util",
    },
  },
  async (client, message) => {
    const pre: number = Date.now();
    const msg = await message.channel.send("Pong!");
    await msg.edit(
      `:ping_pong: Websocket ping: ${client.ws.ping}ms | Bot latency: ${
        Date.now() - pre
      }ms`
    );
  }
);
