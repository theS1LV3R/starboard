import { defaultGuildDocument } from "../setup";
import { Message, GuildMember, Permissions, TextChannel } from "discord.js";
import { GuildDocument } from "../types";
import Command, { getLevel } from "../util/Command";
import Client from "../util/Client";
import { parse } from "discord-command-parser";

export = async (client: Client, message: Message): Promise<void | Message> => {
  const mentionPrefixes = [`<@${client.user.id}>`, `<@!${client.user.id}>`];

  if (!client.db)
    return await message.channel.send(":x: A database error occurred!");

  if (message.author.bot) return;
  if (message.channel.type !== "text") return;

  let guild: GuildDocument = await message.guild.db;

  if (!guild) {
    guild = defaultGuildDocument(message.guild.id);
    client.db.insert("guilds", guild);
  }

  const parsedMessage = parse<Message>(
    message,
    [guild.config.prefix, ...mentionPrefixes],
    {
      allowSpaceBeforeCommand: true,
    }
  );

  if (!parsedMessage.success) return;

  const cmd: Command | null =
    client.commands.get(parsedMessage.command) ||
    client.commands.find((c: Command) =>
      c.config?.aliases?.includes(parsedMessage.command)
    );
  if (!cmd) return;

  if (cmd.config?.level > getLevel(message.member))
    return await message.channel.send(
      "🔒 You do not have permission to use this command."
    );

  const { user, bot } = checkPermissions(cmd, message.member, message.channel);
  if (user.toArray().length || bot.toArray().length) {
    const m: string[] = [
      ":x: The command could not be preformed because one or more permissions are missing.",
    ];

    if (user.toArray().length)
      m.push(
        "You are missing:",
        ...user.toArray(false).map((p) => `> \`${p as string}\``),
        `**Required**: \`${user
          .toArray(false)
          .map((p) => `\`${p}\``)
          .join(", ")}\``
      );
    if (bot.toArray().length)
      m.push(
        "I am missing:",
        ...bot.toArray(false).map((p) => `> \`${p as string}\``),
        `**Required**: ${bot
          .toArray(false)
          .map((p) => `\`${p}\``)
          .join(", ")}`
      );

    return message.channel.send(m.join("\n"));
  }

  if (cmd.config.disabled && !client.admins.has(message.author.id))
    return await message.channel.send("🔒 This command has been disabled.");

  if (
    client.options?.startupCooldown > client.uptime &&
    !client.admins.has(message.author.id)
  )
    return await message.channel.send(
      "🕐 I am still starting up, please try again in a few seconds"
    );

  try {
    cmd.run(client, message, parsedMessage.arguments, guild);
  } catch (err) {
    console.error(err);
    message.channel.send(client.constants.errors.generic);
  }
};

/**
 * Get missing permissions for the bot and the user
 * @param {Command} command The command to check for
 * @param {GuildMember} member The user to check permissions for
 * @param {TextChannel} channel What channel the command was used in
 */
function checkPermissions(
  command: Command,
  member: GuildMember,
  channel: TextChannel
): { user: Permissions; bot: Permissions } {
  const bot = member.guild.me;

  const userPerms = member.permissions;
  let botPerms = bot.permissions;

  const requiredPerms = {
    bot: new Permissions(command.config?.permissions?.bot ?? 0),
    user: new Permissions(command.config?.permissions?.user ?? 0),
  };

  const channelOverwrites = channel.permissionOverwrites.array();

  for (const permissionOverwrite of channelOverwrites) {
    if (
      (permissionOverwrite.type === "role" &&
        bot.roles.cache.has(permissionOverwrite.id)) ||
      (permissionOverwrite.type === "member" &&
        bot.id === permissionOverwrite.id)
    ) {
      botPerms = botPerms.remove(permissionOverwrite.deny);
      botPerms = botPerms.add(permissionOverwrite.allow);
    }
  }

  const missing = {
    user: new Permissions(),
    bot: new Permissions(),
  };

  if (!userPerms.has(requiredPerms.user))
    missing.user = new Permissions(userPerms.missing(requiredPerms.user));
  if (!botPerms.has(requiredPerms.bot))
    missing.bot = new Permissions(botPerms.missing(requiredPerms.bot));

  return missing;
}
