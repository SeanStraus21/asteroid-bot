const Bot = require('./bot.js');
const Discord = require('discord.js');

function Shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
}

function GetArgumentList(message){
	var out = message.content.split(Bot.BotMentionString());
	out = out[out.length - 1].split(' ');
	for(var i=out.length-1;i>=0;i--){
		if (out[i] == ""){
			out.splice(i,1);
		}
	}
	return out;
}

function IsImageName(str){
	if (typeof(str) !== "string"){
		return false;
	}
	var extensions = ["jpg","png","bmp"];
	str = str.split('.');
	str = str[str.length-1];
	for(var i=0;i<extensions.length;i++){
		if(str.toLowerCase() === extensions[i]){
			return extensions[i];
		}
	}
	return false;
}

function GetArticle(word, exceptions) {
	if (typeof(exceptions) === "undefined") {
		exceptions = [];
	}
	var char = word.toLowerCase().charAt(0);
	for (var i = 0; i < exceptions.length; i++) {
		if (exceptions[i].toLowerCase() === word.toLowerCase()) {
			return "";
		}
	}
	if (char === 'a' || char === 'e' || char === 'i' || char === 'o' || char === 'u') {
		return "an ";
	} else {
		return "a ";
	}
}

function Random(max, min) {
	if (typeof(min) === 'undefined') {
		min = 0;
	}
	if (max < min) {
		var temp = max;
		max = min;
		min = temp;
	}
	return (Math.floor(Math.random() * (max - min)) + min);
}

function ParseMentionUser(phrase) {
	var members = Bot.GetAllMembers();

	var id = null;
	phrase = phrase.split(" ");
	for (var i = 0; i < phrase.length; i++) {
		if (phrase[i].includes("<@") && phrase[i].includes(">")) {
			id = phrase[i].replace("<@", "").replace("!", "").replace(">", "");
		}
	}

	if (typeof(id) !== "string") {
		return;
	}

	var user = null;
	for (i = 0; i < members.length; i++) {
		if (id === members[i].id) {
			user = members[i];
			break;
		}
	}

	if (user) {
		return user;
	}
}

exports.Shuffle = function (a) {
	return Shuffle(a);
};

exports.GetArticle = function (word, exceptions) {
	return GetArticle(word, exceptions);
};

exports.ParseMentionUser = function (str) {
	return ParseMentionUser(str);
};

exports.Random = function (min, max) {
	return Random(min, max);
};

exports.GetArgumentList = function (message) {
	return GetArgumentList(message);
};

exports.IsImageName = function (str) {
	return IsImageName(str);
};
