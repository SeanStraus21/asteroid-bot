const Discord = require("discord.js");
const auth = require("./auth.json");
const fs = require("fs");
const Menu = require("./menu.js");
const Characters = require("./characters.js");
const Game = require("./game.js");
const Personalities = require("./personalities.js");

fs.writeFile('log.txt', '', function (err) {
	if (err) {
		throw err;
	}
});

//Global Variables
var botMentionString = "<@!null>";
var persona = Personalities.LoadPersona("Asteroid Bot");

exports.GetStoryChannel = function (channel) {
	return getStoryChannel(channel);
};

exports.GetAllGuilds = function () {
	return GetAllGuilds();
};

exports.GetAllChannels = function () {
	return GetAllChannels();
};

exports.GetAllMembers = function () {
	return GetAllMembers();
};

exports.BotMentionString = function () {
	return botMentionString;
};

exports.Persona = function () {
	return persona;
};

//Member Functions
function writeLine(file, str) {
	fs.appendFileSync(file, str);
	fs.appendFileSync(file, '\n');
}

function GetAllGuilds(){
	return Array.from(bot.guilds.values());
}

function GetAllChannels(){
	return Array.from(bot.channels.values());
}

function GetAllMembers(){
	var guilds = GetAllGuilds();
	var members = [];
	var temp;
	var k=0;
	for (var i=0;i<guilds.length;i++){
		temp = Array.from(guilds[i].members.values());
		for(var j=0;j<temp.length;j++){
			members[k] = temp[j].user;
			k++;
		}
	}

	temp = [];
	var isDuplicate;
	for(i=0;i<members.length;i++){
		isDuplicate = false;
		for(j=0;j<temp.length;j++){
			if(members[i].id === temp[j].id){
				isDuplicate = true;
				break;
			}
		}
		if(!isDuplicate){
			temp.push(members[i]);
		}
	}
	return temp;
}

// Initialize Discord Bot
const bot = new Discord.Client();
const token = auth.token;

bot.on('error', function (err) {
	if (err.code === 'ETIMEDOUT') {
		console.log("timeout error occurred");
	}
	console.log(err);
});

//Callback Function For Bot Login
bot.on('ready', function () {
	console.log('Connected');
	console.log('Logged in as: ');
	console.log(bot.user.username + ' - (' + bot.user.id + ')');
	botMentionString = '<@!' + bot.user.id + '>';
});

//Callback Function For Messages
bot.on('message', function (message) {
	var content = message.content;
	var command;
	var args;

	if (message.author.bot) {
		return;
	}

	if (content.charAt(0) == '!') {

		args = content.toLowerCase().slice(1).trim().split(" ");
		command = args[0];
		switch (command) {
		case "setimg":
			Characters.SetImage(message);
			break;
		case "setname":
			Characters.SetName(message);
			break;
		case "help":
			Menu.Show(message, "help");
			break;
		case "charsheet":
			Characters.ViewCharacterSheet(message);
			break;
		// case "test":
		// 	console.log(bot.channels);
		// 	break;
		// case "clear":
		// 		message.channel.messages.fetch({ limit: 100 }).then(function(messages){
		// 			var messageArray = Array.from(messages.values());
		// 			for(var i=0;i<messageArray.length;i++){
		// 				messageArray[i].delete();
		// 			}
		// 		});
		// 	break;
		default:
			var diceroll = content.slice(1, content.length)
			diceroll = diceroll.split(" ")[0];
			if(Dice.IsDiceRoll(diceroll)){
				Dice.Roll(message, diceroll);
			}else{
				Menu.Show(message, "error", [Bot.Persona().INVALID_COMMAND, Bot.Persona().ERROR_HELP_PROMPT]);
			}
			break;
		}
	}
});

bot.login(token).catch(console.error);
