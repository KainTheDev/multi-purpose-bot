const { Command, Message } = require("eris");
const { client } = require("../..");
const { getPrefix, SRA_Fetch } = require("../../../utils/functions");
const { Text, Embed } = require("../../../utils/structures");
const { default: fetch } = require("node-fetch");

module.exports = new Command('animu',
    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     */
    async function (message, args) {
        const prefix = getPrefix(client)
        const animu = ['face-palm', 'hug', 'pat', 'quote', 'wink', 'random']
        if (!animu.includes(args[0]))
            return await message.channel.createMessage(`# Available usage:\n${animu.map((animu, index) => `${index + 1}. \`\`\`${prefix} sra animu ${animu}\`\`\``).join('\n')}`)
        const animuAction = args[0] === 'random' ? animu[await randomNumber(animu.length - 1)] : args[0];
        const animuData = await SRA_Fetch('animu', animuAction)
        if (animuAction !== 'quote' && (await (await fetch(animuData.link)).text()).startsWith('<!DOCTYPE html>'))
            throw 'Image / GIF not available.';
        const embed = new Embed()
        if (animuAction === 'quote') {
            const { character, anime, sentence } = animuData
            embed.setTitle(`animu ${animuAction}`)
            embed.setDescription(`"*${sentence}*"\n\n> **Quote by**:\`\`\`${character}\`\`\`\n> **From anime**:\`\`\`${anime}\`\`\``)
        }
        return await message.channel.createMessage({ embed })
    }, {
    aliases: ['anime'],
    description: 'Send anime quote or GIF',
    usage: 'sra animu <type>'
})