var personalities = [{
	name: "Asteroid Bot",
	HELP_TEXT_TITLE: "Asteroid Bot Manual",
	INVALID_COMMAND: "Invalid Command",
	ERROR_HELP_PROMPT: "Enter **help** for a list of valid commands",
	GENERIC_ERROR_TITLE1: "Error",
	DM_ONLY_ERROR: "Command can only be used in private messages",
	STORY_CHANNEL_ONLY_ERROR: "Command can only be used in **story channels**",
	GENERIC_SUCCESS:"Operation Successful",
	MISSING_ARGUMENT_TITLE:"Additional Arguments Required",
	MISSING_ARGUMENT_TEXT_SINGULAR: function(argument){
		return "Missing argument [" + argument + "] is required";
	},
	MISSING_ARGUMENT_TEXT_PLURAL: function(args){
		var output = "The arguments: ";
		for(var i=0;i<args.length;i++){
			output = output + "[" + args[i] + "] ";
		}
		output = output + "are required";
		return output;
	},
	CHARACTER_WITH_NAME_ALREADY_EXISTS:"You already have a character with that name. You can use **deletechar** on the old one if you want",
	NO_CHARACTER_SELECTED:"You don't have any characters selected. Use **newchar [name]** to create one or **loadchar [name] ** if you have others",
	CHARACTER_WITH_NAME_DOES_NOT_EXIST: function(name){return "You don't have any characters named **" + name + "**";},
	CHARACTER_WITH_NAME_NOT_IN_GAME: function(name){return "The character **" + name + "** is from a different game. You you can try to **import** it";},
	CHARACTER_CREATION_SUCCESSFUL: function(name){return "**" + name + "** has been created!";},
	CHARACTER_LOAD_SUCCESSFUL: function(name){return "Successfully loaded **" + name + "**";},
	CHARACTER_DELETION_SUCCESSFUL: function(name){return "Successfully deleted **" + name + "**";},
	NOT_IN_WORLD_ERROR: "You're not in a game right now. Use the **Join** command while in a game server.",
	ALREADY_IN_WORLD_ERROR: "You are already in a game",
	WORLD_JOINED_SUCCESS: "You have joined the game",
	HELP_TEXT_GETTING_STARTED: "Once you **join**, PM this bot to set up a character using the **newchar** command",
	WORLD_EXIT_SUCCESS: "You have left the game",
	IMAGE_REQUIRED: "You must attach an image or pass a link to the URL of one",
}];



exports.LoadPersona = function (name) {
	for(var i=0;i<personalities.length;i++){
		if(personalities[i].name === name){
			return personalities[i];
		}
	}
	return false;
};