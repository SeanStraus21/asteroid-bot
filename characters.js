const Discord = require("discord.js");
const Bot = require("./bot.js");
const Utility = require("./utility.js");
const Menu = require("./menu.js");
const fs = require("fs");
const Request = require("request");
const Path = require("path");

var imageDirectory = Path.resolve(__dirname, './images');
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
	char.race = "Human";
	char.class = "Commoner";
	char.alignment = "neutral";
	char.level = 1;
	char.hp = 0;
	char.gender = "M"
	char.height = "5.5"
	char.age = 21
	char.weight = 150
	char.hair = "black"
	char.eyes = "black"
	char.strength = 8;
	char.dexterity = 8;
	char.constitution = 8;
	char.intelligence = 8;
	char.wisdom = 8;
	char.charisma = 8;
	char.speed = ""
	char.skills = generateBaseSkills();
	userList.push(char);
	SaveCharacters();
	return char;
}

function CreateNewSkill(name, modifier, rank, miscModifier) {
    var skill = {}
    skill.abilityModifier = modifier;
    skill.rank = rank;
    skill.name = name;
    skill.miscModifier = miscModifier;
    skill.totalBonus = modifier + rank + miscModifier;
    return skill
}

function generateBaseSkills() {
    skills = [
        'acrobatics', 'appraise', 'bluff', 'climb',
        'craft1', 'craft2', 'craft3', 'diplomacy', 'disable device',
        'disguise', 'escape artist', 'fly', 'handle animal', 'heal', 'intimidate',
        'knowledge (arcana)', 'knowledge (dungeoneering)', 'knowledge (engineering)',
        'knowledge (geography)', 'knowledge (history)', 'knowledge (local)', 'knowledge (nature)',
        'knowledge (nobility)', 'knowledge (planes)', 'knowledge (religion)', 'linguistics', 'perception',
        'perform1', 'perform2', 'profession1', 'profession2', 'ride', 'sense motive', 'sleight of hand',
        'spellcraft', 'stealth', 'survival', 'swim', 'use magic device'
    ]

    finalSkillsArray = []

    for(var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        newSkill = CreateNewSkill(skill, 0, 0, 0)
        finalSkillsArray.push(newSkill)
    }

    return finalSkillsArray
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
		var userid = message.author.id;
		var username = message.author.username;
		var character = GetCharacterByUserName(username);
		var imageName = "portrait." + Utility.IsImageName(image);
		var path = Path.resolve(imageDirectory) + "/" + userid;
			if (!fs.existsSync(path)){
			fs.mkdirSync(path);
		}
		var saveLocation = (path + "/" + imageName);
		
		Request.get(image).on('response', function() {
			
			character.portrait = imageName;
			SaveCharacters();
			Menu.Show(message, "success", "Your portrait has been set");
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
	const embed = new Discord.MessageEmbed();

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

	var charsheet = GetCharacterByUserName(user.username);
	if (!charsheet) {
		charsheet = NewCharacter(user.username);
	}

	var buttons = ["🚫"];

	embed.setTitle(charsheet.username);
	var path;
	if(charsheet.portrait == "default.png"){
		path = "default.png";
	}else{
		path = user.id + "/portrait.png";
	}
	embed.attachFiles("./images/" + path);
	embed.setThumbnail("attachment://" + charsheet.portrait);

	embed.setColor("#FF0000");
	
	embed.addField(charsheet.name, "Level " + charsheet.level + " " + charsheet.race + " " + charsheet.class);
	embed.addField("Alignment: ", charsheet.alignment);
	embed.addField("Attributes: ", 
		"Strength: " + charsheet.strength + "\n" +
		"Dexterity: " + charsheet.dexterity + "\n" +
		"Constitution: " + charsheet.constitution + "\n" +
		"Intelligence: " + charsheet.intelligence + "\n" +
		"Wisdom: " + charsheet.wisdom + "\n" +
		"Charisma: " + charsheet.charisma);

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

function HandleCharacterSheetButtonPress(reaction, user) {
	if (reaction.emoji.reaction.count === 1) {
		return;
	}
	var menu = reaction.message;
	var buttonName = reaction.emoji.name;
	var buttons = ["🚫"];
	var buttonIndex = buttons.indexOf(buttonName);
	var character = GetCharacterByUserName(user.username);

	switch (buttonIndex) {
		case 0:
			menu.delete();
			break;
	}
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

