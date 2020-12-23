import Command from "../util/command";
import Client from "../util/Client";
import {
  Collection,
  User,
  MessageReaction,
  Message,
  MessageEmbed,
  ReactionCollector,
} from "discord.js";
import { CommandCategories } from "@types";
import { eyes, crown } from "../util/emoji.json";

export default new Command(
  {
    name: "oldhelp",
    level: 0,
    skipLoading: false,
    disabled: true,
    help: {
      description: "Get help with commands",
      usage: "[command]",
    },
  },
  async (client, message, _args, guild) => {
    const main: Collection<CommandCategories, MainHelpOptions> = new Collection(
      [
        ["admin", { emoji: eyes, text: "Commands for server admins" }],
        [
          "owner",
          {
            emoji: crown,
            display: ({ admins }: Client, { author: { id } }: Message) =>
              admins.has(id),
            text: "Bot admin commands",
          },
        ],
      ]
    );

    const embed = generateMainEmbed(client, message, main).setFooter(
      `The prefix for this guild is: ${guild.config.prefix}`
    );

    const msg = await message.channel.send(embed);

    // [key, value] = [, value] = [, { emoji }]
    // extract emoji from value using destructuring

    for (const [, value] of main) {
      if ((value?.display && value?.display(client, message)) ?? true)
        await msg.react(value.emoji.unicode);
    }

    generatePage(client, { level: 0 });
    tabulateEmbed(client, msg, message, main);
  }
);

function generateMainEmbed(
  client: Client,
  message: Message,
  fields: Collection<string, MainHelpOptions>
): MessageEmbed {
  const embed = client.defaultEmbed();
  for (const [key, value] of fields) {
    if ((value?.display && value?.display(client, message)) ?? true) {
      embed?.description
        ? (embed.description += `\n${
            (value.emoji as Record<string, string>).twemoji
          } - ${key}: \`${value?.text}\``)
        : embed.setDescription(
            `${(value.emoji as Record<string, string>).twemoji} - ${key}: \`${
              value?.text
            }\``
          );
    }
  }
  return embed;
}

function generatePage(
  client: Client,
  filter: { level?: number; category?: string } = {}
): MessageEmbed {
  const cmdList = client.commands.filter((command) => {
    if (filter.level !== null && !filter.category)
      return command.config?.level === filter.level;

    if (filter.level === null && filter.category)
      return command.config?.help?.category === filter.category;

    if (filter.level !== null && filter.category)
      return (
        command.config?.level === filter.level &&
        command.config?.help?.category === filter.category
      );
    return true;
  });

  const embed = client.defaultEmbed();

  for (const [cmd, { config }] of cmdList) {
    const t = `\`${cmd}\` - (${!
      config?.help?.shortDescription ??
      config?.help?.description ??
      "This command hasn't been documented yet!"
    })`;

    embed.description
      ? (embed.description += "\n" + t)
      : embed.setDescription(t);
  }
  return embed;
}

function tabulateEmbed(
  client: Client,
  collectorMessage: Message,
  message: Message,
  mainPage: Collection<CommandCategories, MainHelpOptions>
): void {
  const emojis = mainPage.map(({ emoji }) => emoji);
  const filter = (reaction: MessageReaction, user: User): boolean => {
    let valid = false;
    for (const emoji of emojis) {
      valid =
        valid ||
        ((Object.values(emoji).includes(reaction.emoji.name) ||
          Object.values(emoji).includes(reaction.emoji.id)) &&
          !user.bot &&
          user.id === message.author.id);
    }
    return valid;
  };
  const RC = new ReactionCollector(collectorMessage, filter);

  RC.on("collect", (reaction, _user) => {
    let category: string;

    for (const [key, value] of mainPage) {
      if (
        Object.values(value.emoji).includes(reaction.emoji.id) ||
        Object.values(value.emoji).includes(reaction.emoji.name)
      )
        category = key;
    }

    collectorMessage.edit(
      generatePage(client, {
        category: category,

        // find(
        //   (c) =>
        //     Object.values(c.emoji).includes(reaction.emoji.id) ||
        //     Object.values(c.emoji).includes(reaction.emoji.name)
        // )[0],
      })
    );
  });
}

interface MainHelpOptions {
  emoji: { unicode: string; twemoji: string };
  display?: (client: Client, message: Message) => boolean;
  text: string;
}
