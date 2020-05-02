var Discord = require('discord.js');
var Bot = require('./bot.js');

var closeButton = "🚫";

function Close(menu){
	menu.delete();
}

function HandleCloseButton(reaction, user){
	if(reaction.emoji.reaction.count === 1){return;}
	var menu = reaction.message;
	var buttonName = reaction.emoji.name;
	if (buttonName === closeButton){
		Close(menu);
	}
}

function AttachCloseButton(msg){
	msg.react(closeButton);	
	msg.awaitReactions(HandleCloseButton);
}

function ShowHelpMenu(message){
	var embed = new Discord.MessageEmbed();
	embed.title = Bot.Persona().HELP_TEXT_TITLE;
	embed.setDescription("[] indicate required arguments, <> indicate optional arguments");
	embed.addFields(
	    {
	        "name": "setimg [image URL | *image attachment*]", "value": "Set image link or attachment for the current Discord user"
	    },
	    {
	        "name": "setname [name]", "value": "Set character name for current Discord user"
	    },
	    {
	        "name": "charsheet <username>", "value": " View the entire charsheet for the team or a specific character"
	    },
	    {
	        "name": "inventory", "value": " Show character inventory"
	    },
	    {
	        "name": "XdY+Z", "value": " Use \"!\" followed by dice expression to roll dice "
	    },
	    {
	        "name": "setCharacterDetails", "value": "Comma-separated values in the following order: race, class, alignment, level, hp, gender, height, age, weight, hair, eyes"
	    }
	);

	message.channel.send(embed).then(AttachCloseButton).catch(console.log);
}

function ShowErrorMenu(message, args){
	var embed = new Discord.MessageEmbed();
	embed.addField(args[0],args[1]);
	message.channel.send(embed).then(AttachCloseButton).catch(console.log);
}

function ShowConfirmationMenu(message, text){
	var channel = message.channel;
	var embed = new Discord.MessageEmbed();
	embed.addField(Bot.Persona().GENERIC_SUCCESS, text);
	channel.send(embed).then(AttachCloseButton).catch(console.log);

	message.delete();
}

exports.Show = function (message, menu, args) {
	switch(menu){
	case "help":
		ShowHelpMenu(message);
		break;
	case "error":
		ShowErrorMenu(message, args);
		break;
	case "success":
		ShowConfirmationMenu(message, args);
		break;
	}
};