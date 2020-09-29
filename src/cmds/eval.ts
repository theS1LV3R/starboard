import Command from '@command'
import { runInThisContext } from 'vm'
import { inspect } from 'util'

export default new Command({
  name: 'basiceval',
  aliases: ['basic_eval'],
  level: 3,
  disabled: true
}, async (_client, message, args) => {
  if (!args[0]) return await message.channel.send(':x: You must include code to execute')

  try {
    const result = await runInThisContext(args.join(' '), { filename: message.author.id })

    message.channel.send((typeof result === 'string' ? result : inspect(result)).substring(0, 2000), { code: 'js' })
  } catch (err) {
    message.channel.send(err, { code: 'js' })
  }
})
