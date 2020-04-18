const Utility = require('./utility.js');
const Menu = require('./menu.js');
const fs = require('fs');
const Request = require('request');
const Path = require('path');

var imageDirectory = Path.resolve(__dirname, 'character/images');
var userList = [];
LoadCharacters();

function SaveCharacters(){
	var data = JSON.stringify({characters: userList});
	fs.writeFileSync('characterfile.json', data);
}

function LoadCharacters(){
	var rawData = fs.readFileSync('characterfile.json');
	var parsedData = JSON.parse(rawData);
	userList = parsedData.characters;
}

function CreateNewCharacter(username){
	var char = {};
	char.name = "Anonymous";
	char.username = username;
	char.portrait = "default.png";
	userList.push(char);
	SaveCharacters();
	return char;
}

function GetCharacterByUserName(username){
	for(var i=0;i<userList.length;i++){
		if(userList[i].username.toLowerCase() === username.toLowerCase()){
			return userList[i];
		}
	}
	return CreateNewCharacter(username);
}

function SetCharacterImage(message){
	var args = Utility.GetArgumentList(message);
	var attachments = Array.from(message.attachments.values());
	if ((attachments.length === 0 || !Utility.IsImageName(attachments[0].url)) && (args.length < 2 || !Utility.IsImageName(args[1]))){
		Menu.Show(message, "error", [
			Bot.Persona().GENERIC_ERROR_TITLE1, 
			Bot.Persona().IMAGE_REQUIRED	
		]);
	} else {
		var image;
		if(args.length >= 2 && Utility.IsImageName(args[1])){
			image = args[1];
		}else{
			image = attachments[0].url;
		}
		var username = message.author.username;
		var imageName = username +  "." + Utility.IsImageName(image);
		var saveLocation = Path.resolve(imageDirectory + "/" + imageName);
		Request.get(image).on('response', function() {
			var character = GetCharacterByUserName(username);
			character.portrait = imageName;
			SaveCharacters();
			Menu.Show(message, Bot.Persona().GENERIC_SUCCESS, "Your portrait has been set");
		}).pipe(fs.createWriteStream(saveLocation));
	}
}

function SetCharacterName(message){
	var args = Utility.GetArgumentList(message);
	if (args.length < 2) {
		Menu.Show(message, "error", [
			Bot.Persona().MISSING_ARGUMENT_TITLE, Bot.Persona().MISSING_ARGUMENT_TEXT_SINGULAR("character_name")
		]);
	} else {
		var name = args.splice(1).join(' ');
		GetCharacterByUserName(message.author.username).name = name;
		SaveCharacters();

		Menu.Show(message, Bot.Persona().GENERIC_SUCCESS, "Your name has been set to **" + name + "**");
	}
}

function ViewCharacterSheet(message){
	var args = Utility.GetArgumentList(message);
	var user;
	var username;
	var embed = new Discord.RichEmbed();
	if (args.length < 2) {
		user = message.author;
	} else {
		username = args.splice(1,args.length).join(" ");
		if (username.includes("<@")) {
			user = Utility.ParseMentionUser(username);
			if (!user) {
				message.channel.send("The specified user does not exist");
				return;
			}
		} else {
			var i;
			var members = Bot.GetAllMembers();
			for (i = 0; i < members.length; i++) {
				if (members[i].username.toLowerCase() === username.toLowerCase()) {
					user = members[i];
				}
			}
			if (!user) {
				message.channel.send("The specified user does not exist");
				return;
			}
		}
	}

	var charsheet = GetCharacterByName(user.username);
	if (!charsheet) {
		charsheet = NewCharacter(user.username);
	}

	var buttons = ["🚫"];

	embed.title = charsheet.username;
	embed.setThumbnail(charsheet.portrait);
	
	// embed.addField("Class: ", "Level " + charsheet.level + " " + charsheet.class);
	// embed.addField("Alignment: ", charsheet.alignment);
	// embed.addField("Strength: ", charsheet.strength, true);
	// embed.addField("Toughness: ", charsheet.toughness, true);
	// embed.addField("Speed: ", charsheet.speed, true);
	// embed.addField("Magic: ", charsheet.magic, true);
	// if (charsheet.skillPoints > 0) {
	// 	var actionString = "**Skillpoints**: " + charsheet.skillPoints;
	// 	actionString += "\n:one: Increase **Strength**";
	// 	actionString += "\n:two: Increase **Toughness**";
	// 	actionString += "\n:three: Increase **Speed**";
	// 	actionString += "\n:four: Increase **Magic**";
	// 	embed.addField("Thou hast unspent skill points!", actionString, true);
	// 	buttons.push("1⃣");
	// 	buttons.push("2⃣");
	// 	buttons.push("3⃣");
	// 	buttons.push("4⃣");
	// }

	message.channel.send(embed).then(function (msg) {
		msg.awaitReactions(HandleCharacterSheetButtonPress).catch();
		var i = 0;
		var arr = buttons;
		var l = arr.length;
		msg.react(arr[i]).then(function recursiveReactionCallback(msgReaction){
			i++;
			if(i < l){
				msgReaction.message.react(arr[i]).then(recursiveReactionCallback).catch();
			}
		}).catch();
	});
}

exports.SetImage = function (message) {
	return SetCharacterImage(message);
};

exports.SetName = function (message) {
	return SetCharacterName(message);
};

exports.ViewCharacterSheet = function (message) {
	return ViewCharacterSheet(message);
};

exports.Test = function () {
	console.log("testing");
};

