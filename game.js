const Utility = require('./utility.js');
const Menu = require('./menu.js');
const fs = require('fs');


function rollDie(sides){
	var result;
	if (sides === "f"){
		result = Math.floor(Math.random() * 3) - 1;
	}else{
		sides = Number(sides);
		if(typeof(sides) === "number" && !isNaN(sides) && sides > 0){
			result = Math.ceil(Math.random() * sides);
		}else{
			result = NaN;
		}
	}
	return result;
}

function TrimArray(arr){
	for(var i=arr.length-1;i>=0;i--){
		if(arr[i] == ''){
			arr.splice(i,1);
		}
	}
}

function isDiceRoll(str){
	var isValid = false;
	var potentialNumber;
	if(str.indexOf('d') === str.lastIndexOf('d') && str.includes('d') && str.lastIndexOf('d') != str.length-1){
		str = str.split('d');
		TrimArray(str);
		if (str.length === 1 || str.length === 2){
			isValid = true;
			for(var i=0;i<str.length;i++){
				potentialNumber = Number(str[i]);
				if(typeof(potentialNumber) !== "number" || isNaN(potentialNumber) || potentialNumber <= 0){
					if(str[i] != 'f') {
						isValid = false;
						break;
					}
				}
			}
		}
	}
	return isValid;
}

function rollDice(message, argString) {
	var sideCount;
	var diceCount = 1;
	var result = 0;
	var args = argString.split('d');
	TrimArray(args);
	if(args.length === 1){
		sideCount = args[0];
	}else{
		diceCount = Number(args[0]);
		sideCount = args[1];
	}
	for(var i=0;i<diceCount;i++){
		result += rollDie(sideCount);
	}
	if(sideCount === 'f' && result >= 0){
		result = "+" + result;
	}
	message.channel.send(argString + " = " + result);
}

exports.IsDiceRoll = function(str){
	return isDiceRoll(str);
};

exports.Roll = function(message, argString){
	return rollDice(message, argString);
};