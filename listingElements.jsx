#include "json2.js"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* *************************   setLabel *****************************************/
//adds a "key":"value" pair to the script label property of a InDesign page "element"
function encodeVisibleLabel(element, key, value){
	
	key = "\"" + key + "\"";
	value = "\"" + value + "\"";
	
	var bValueStored = false;
	
	var index = element.label.indexOf(key); // search the string and see if the variable is already there
	if(index !== -1) //the key already exists
	{
		 // we need to go in and replace the existing value associated with the key
		var variables = element.label.split(","); //splits the label into an array of key:values
		for (var i = 0; (i < variables.length) && (!bValueStored ); i++){
			var keyValuePair =  variables[i].split(":"); // not all labels may have the Key:value formate
			if(keyValuePair.length > 1){ //make sure we've got a pair otherwise we aren't interested in this variable
				if(keyValuePair[0]===key){
					keyValuePair[1] = value;
					variables[i] = keyValuePair.join(":");
					// we did find it in the array and replaced the old value.  Zip it back up
					element.label = variables.join(",");
					bValueStored = true;
				}
			}
		}//end for-loop
	}

	if(!bValueStored){
		if(element.label.localeCompare("") === 0){
			element.label += key + ":" + value;
		}else{			
			element.label += "," + key + ":" + value;
		}
		bValueStored = true;
	}
}

/************************************** readLabel **************************************/
//reads a "key" variable  from a script label property of a InDesign page "element" and returns the string value
function readVisibleLabelVariable(element, key){ //returns null if the variable with a value isn't found
	//add the quote marks around the key term so that we make sure to find it in the string where the variables are enclosed in Quotes
	key = "\"" + key + "\"";
		
	var value = null;
	
	var index = element.label.indexOf(key); // search the string and see if the variable is already there
	if(index !== -1) //the key already exists
	{
		element.label = element.label.replace(/ /g,""); //remove any  white spaces if they have accidentally gotten into the label
		var variables = element.label.split(","); //split the label into an array of "key:value"'s
		for (var i = 0;  i < variables.length; i++){
			var keyValuePair =  variables[i].split(":"); // split the key:value string int a [key, value] array
			if(keyValuePair.length > 1){ //make sure we've got a pair otherwise we aren't interested in this variable
				//if(keyValuePair[0].localeCompare(key) === 0){
				if(keyValuePair[0]===key){ // is this the correct variable name?
					value = keyValuePair[1]; //read the label variable value
					value = value.replace(/\"/g,""); //remove any \" escape characters from the value (NOTE: the /g means globally replace
					break;
				}
			}
		}
	}
	return value;
}

/************************************** searchElementArrayLabels **************************************/
// returns an array containing index values of the PageItemsArray that match the search key == value
function searchArrayOfVisibleLabel(elements, key, value){ //given an array of PageItems, search for items that have a label value that contains the key == value
	if(typeof(value) === "number" || typeof(value) === "boolean"){//convert search objects to a string as all stored values are saved as a string
		value = value.toString();
	}
	var matches = findMatchingElements(elements, key, value, readVisibleLabelVariable);
	return matches;
	
}
	


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// storing and retrieving property data of in InDesign document PageItems Hidden Script Labels
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**********************************    setPropertyData   **************************************************************/
//this function allows us to store the objectData object as a string inside the hidden label with the name "key"

function storeDataInHiddenLabel(element, key, objectData){
	element.insertLabel(key, JSON.stringify(objectData)); //insertLabel is a adobe builtin that stores hidden data with a PageItem
	
}

/****************    getPropertyData   ***************************************************************************************************************/
//this function allows us to extract the objectData object stored as a string inside the  PageItem "element" hidden label with the name "key"
function getDataFromHiddenLabel(element, key){
	return JSON.parse(element.extractLabel(key)); //extractLabel is a adobe builtin that extracts hidden label data from a PageItem
	
}

/*********************************************** readObjectValue(objectX, variableName) ************************/
//this function allows us to read a variable value from the objectX using a variable name stored inside a string
function readObjectLiteralValue(objectLiteral, variableName){
	try {
		propertyValue = objectLiteral[variableName]; //the equivalent of  value = propElementObject.variableName;
	}catch(e){
			alert("There is no " + variableName + "variable in the data stored in the object.");
	}

	return propertyValue;
}
	
/************************************** searchElementArrayLabels ***********************************************/
 //returns and array of indexs that match key == value in the given an array of PageItems
function searchArrayOfObjects(objectArray, variableName, value){
	
	var matches = findMatchingElements(objectArray, variableName, value, readObjectLiteralValue);
	return matches;
	
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************  Search an array of objects for matchs to a variable:value pair  *******************************/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//returns an array of indecies in the dataObjectArray that match the variable value being searched for
function findMatchingElements(dataObjectArray, searchVariableKey, searchValue, readFunction){
	
	var matchingObjectIndex = []; //index in the dataObjectArray of the objects that match the search querey
	var numOfMatches = 0; //how many matches were found
	var variableValue = null;
		
	for( var i = 0; i < dataObjectArray.length; i++)
	{
		//the readFucntion designates how to extract the value associated with the variable we are interested in
		variableValue = readFunction(dataObjectArray[i],searchVariableKey); 
				
		if(variableValue === searchValue){
			matchingObjectIndex[++numOfMatches-1]  = i;
		}
		
	}

	return matchingObjectIndex;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	
	