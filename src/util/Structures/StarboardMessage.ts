import {
  Nullable,
  StarboardMessage as SM,
  StarboardMessageRaw
  // Starboard
} from '@types'

import {
  Starboard
} from '@util/Structures/Starboard'

import {
  Guild,
  Message,
  MessageAttachment,
  GuildMember,
  TextChannel
} from 'discord.js'

export class StarboardMessage implements SM {
  msg: Message // chat msg
  sbMsg: Nullable<Message> // starboard msg
  content: string
  channel: TextChannel
  attachments: MessageAttachment[]
  author: GuildMember
  date: Date
  count: number
  starredAt: Date

  constructor (public guild: Guild, public sb: Starboard, public message: StarboardMessageRaw) {
    this.assign()
      .catch(console.error)
  }

  private async assign (): Promise<void> {
    this.msg = (this.guild.channels.cache.get(this.message.channel) as TextChannel).messages.cache.get(this.message.msg) ||
      await (this.guild.channels.cache.get(this.message.channel) as TextChannel).messages.fetch(this.message.msg)
    this.content = this.msg.content
    this.sbMsg = this.sb.channel.messages.cache.get(this.message.sbMsg) ||
      await this.sb.channel.messages.fetch(this.message.sbMsg) ||
      null
    this.attachments = this.msg?.attachments?.array()
    this.author = this.guild.members.cache.get(this.message.author) ||
      await this.guild.members.fetch(this.message.author)
    this.date = this.message.date
    this.count = this.message.count
    this.starredAt = this.message.starredAt
  }

  async send (): Promise<Message> {
    const msg = await this.sb.channel.send(this.message.content)
    this.sbMsg = msg
    return msg
  }

  async updateCount (count: number): Promise<void> {
    await this.sbMsg?.edit(`Count: ${count}`)
    this.count = count

    await this.guild.client.db.updateStarCount(this.guild.id, this.msg.id, count)
  }

  toRaw (): StarboardMessageRaw {
    return {
      content: this.msg.content,
      msg: this.msg.id,
      sbMsg: this.sbMsg.id,
      channel: this.channel.id,
      attachments: this.attachments.map((a) => a.url),
      author: this.msg.author.id,
      date: this.date,
      count: this.count,
      starredAt: this.starredAt
    }
  }
}
