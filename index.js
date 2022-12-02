const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
require('dotenv/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventsFile = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const commandsPath = path.join(__dirname, 'commands');
const commandsFile = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of eventsFile) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if ('name' in event && 'execute' in event) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    } else {
        console.log(`[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`);
    }
}

for (const file of commandsFile) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// client.once(Events.ClientReady, client => {
// 	console.log(`Ready! Logged in as ${client.user.tag}`);
// });

// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	const command = interaction.client.commands.get(interaction.commandName);

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return;
// 	}

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(`Error executing ${interaction.commandName}`);
// 		console.error(error);
// 	}
// });

// client.on(Events.MessageCreate, message => {
//     if (message.content === 'ping') {
//         message.reply('pong')
//     }
// });

client.login(process.env.TOKEN);