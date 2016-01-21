#include "listingElements.jsx"


var errorCode = null;
//for testing InDesign specific features
var myDocument = app.documents.item(0);
var myPage = myDocument.pages.item(0);


mainLabelTest(); //invoke the testing

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//mainTest proceedure function
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mainLabelTest()
{
	testVisibleLabelEncodeDecode();
	testVisibleLabelSearch();
	testHiddenLabelFunctionality();
	testReadObjectLiteralValue();
	
	//end of testing, report results
	if(errorCode !== null){
		alert(errorCode);
	}else{
		alert("All Label Encoding, Decoding, and Search tests passed");
	}


}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Testing the use of script labels to encode data variables
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function testVisibleLabelEncodeDecode()
{
	var element = {label:""};
	var testKeys = ["objType", "objType", "positionLock", "index"]; //note, the label encoding tests are hard coded to values in the first 3 cells
	var testValues = ["propertyElement", "fixed", "unlocked", 1]; //note, the label encoding tests are hard coded to values in the first 3 cells


	for (var i = 0; i<testKeys.length; i++){
		encodeVisibleLabel(element, testKeys[i], testValues[i]);
	
		//alert(element.label + " --> \"objType\":\"propertyElement\"  --> "  + key + ":" + value  );
		if(i === 0 && element.label.localeCompare("\""+testKeys[i]+"\":\"" + testValues[i]+"\"") !== 0){
			errorCode = "Error: The label[ " + i +"] was NOT correctly encoded \r";
		}
	
		if(i === 1 && element.label.localeCompare("\""+testKeys[i]+"\":\"" + testValues[i]+"\"") !== 0){
			errorCode = "Error: The label[" + i +"] was NOT correctly encoded \r";
		}
	
		if(i === 2 && element.label.localeCompare("\""+testKeys[i-1]+"\":\"" + testValues[i-1]+"\",\"" + testKeys[i]+"\":\"" + testValues[i]+"\"") !== 0){
			errorCode = "Error: The label[ " + i +"] was NOT correctly encoded \r";
		}

		var result = readVisibleLabelVariable(element, testKeys[i]);
	
		if(result.localeCompare(testValues[i]) !== 0){
				errorCode += testKeys[i] + " Label (" + i+") was not correctly encoded or decoded -> encodedValue = " + testValues[i] + " <and> decodedValue = " + result + "\r";
		}
	}//end for loop

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Testing the find / search feature
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function testVisibleLabelSearch()
{
	var element = {label:""};
	var elementArray = [];
	var testKeys = ["objType", "objType", "positionLock", "index", "bExist"]; //note, the label encoding tests are hard coded to values in the first 3 cells
	var testValues = ["propertyElement", "fixed", "unlocked", 0, true];
	var arrayLength = 5;
	var matchingLabels = null;
		
		//initialize the array of variables
	for(var i = 0; i < arrayLength; i++){
		elementArray[i] = {label:""};	
		if(i%2 === 0){
			encodeVisibleLabel(elementArray[i], testKeys[0], testValues[0]); //encode even with propertyElement
		}else{
			encodeVisibleLabel(elementArray[i], testKeys[1], testValues[1]); //encode odd with fixed
		}
		encodeVisibleLabel(elementArray[i], testKeys[2], testValues[2]); 
		encodeVisibleLabel(elementArray[i], testKeys[3], i); //encode the order of index into the label
		encodeVisibleLabel(elementArray[i], testKeys[4], testValues[4]); 
		
	}
	
	//check objectType:propertyElement
	matchingIndexArray = searchArrayOfVisibleLabel(elementArray, "objType", "propertyElement");
	if( !(matchingIndexArray[0] == 0 &&	matchingIndexArray[1] == 2 &&	matchingIndexArray[2] == 4)){
		errorCode += "LabelSearch didn't find the proper number of objType:propertyElements\r";
	}
	
	//check positionLock:unlocked
	matchingIndexArray = searchArrayOfVisibleLabel(elementArray, "positionLock", "unlocked");
	if(matchingIndexArray.length !==5){
	errorCode += "LabelSearch didn't find the proper number of positionLock:unlocked elements\r";
	}
	//check positionLock:unlocked
	matchingIndexArray = searchArrayOfVisibleLabel(elementArray, "positionLock", "locked");
	if(matchingIndexArray.length !==0){
		errorCode += "LabelSearch didn't find the proper number of positionLock:locked elements\r";
	}
	//check index:number (1)
	matchingIndexArray = searchArrayOfVisibleLabel(elementArray, "index", 1);
	if(matchingIndexArray.length !== 1){
		errorCode += "LabelSearch didn't find the proper number of index:1 elements\r";
	}
	//check index: true --> mixed types, shouldn't find any matches 
	matchingIndexArray = searchArrayOfVisibleLabel(elementArray, "index", true);
	if(matchingIndexArray.length !== 0){
		errorCode += "LabelSearch is inproperly associating a value of 1 as equal to true\r";
	}
	
	//check bExist: true 
	matchingIndexArray = searchArrayOfVisibleLabel(elementArray, "bExist", true);
	if(matchingIndexArray.length !== 5){
		errorCode += "LabelSearch didn't find the proper number of bExist:true elements\r";
	}
	
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Testing the use of hidden script labels to encode and decode objects and search arrays of objects
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function testHiddenLabelFunctionality(){
	var myPageElements = [];
	myPageElements[0] = myPage.textFrames.add();
	myPageElements[0].geometricBounds = [12,12,45,45];
	myPageElements[1] = myPage.rectangles.add();
	myPageElements[1].geometricBounds = [3,3,15,15];
	
	myPageElements[2] = myPage.groups.add(myPageElements);
	
	var sampleObj = {name:"propertyDataObject", a:1,b:true, str:"This is a string. $100,000.00 Contact 834-34-7877 Beds:3 / Baths:4"};
	var sampleLayout = {name:"layoutDataObject", ad:"Oliver", page:22, showAddress: false};
	var objectData = [];
	var decodedObjData = null;
	var layoutData = [];
	var decodedLayoutData = null;
	
	var a = [1,2,3];
	var b = [true, false, true];
	var str = ["This is a string. $100,000.00 Contact 834-34-7877 Beds:3 / Baths:4", "One hundred million acres +/-, \"and a Grogeous master\"", "Beautiful home on a beautiful hill. $354,000.00"];
	
	for (var i = 0; i< a.length; i++){
		objectData[i] = {};
		objectData[i].name = "propertyDataObject";
		objectData[i].a = a[i];
		objectData[i].b = b[i];
		objectData[i].str = str[i];
		// test the encoding and decoding of data
		storeDataInHiddenLabel(myPageElements[i], objectData[i].name, objectData[i]);
		decodedObjData = getDataFromHiddenLabel(myPageElements[i], objectData[i].name);
		
		if(objectData[i].name !== decodedObjData.name || objectData[i].a !== decodedObjData.a || objectData[i].b !== decodedObjData.b || objectData[i].str !== decodedObjData.str )
		{
			errorCode += "Object Data wasn't encoded/decoded properly in the Hidden Labels for element " + i + "\r";
		}
		// test the encoding and decoding of data
		layoutData[i] = sampleLayout;
		storeDataInHiddenLabel(myPageElements[i], layoutData[i].name, layoutData[i]);
		decodedLayoutData = getDataFromHiddenLabel(myPageElements[i], layoutData[i].name);
		
		if(layoutData[i].name !== decodedLayoutData.name || layoutData[i].ad !== decodedLayoutData.ad || layoutData[i].page !== decodedLayoutData.page || layoutData[i].showAddress !== decodedLayoutData.showAddress )
		{
			errorCode += "Object Data wasn't encoded/decoded properly in the Hidden Labels for element " + i + "\r";
		}
		
	}

	//Test the search feature
	var matches = [];
	matches = searchArrayOfObjects(objectData, "b", true);
	if(matches.length !== 2){
		errorCode += "searchArrayOfObjects isn't working correctly on variable b \\ booleans " + matches.length + "\r";
	}

	matches = searchArrayOfObjects(objectData, "a", 3);
	if(matches.length !== 1){
		errorCode += "searchArrayOfObjects isn't working correctly on variable a \\ numbers " + matches.length + "\r";
	}

	matches = searchArrayOfObjects(objectData, "str", str[0]);
	if(matches.length !== 1){
		errorCode += "searchArrayOfObjects isn't working correctly on strings " + matches.length + "\r";
	}
		
	
}



function testReadObjectLiteralValue(){
	
	var testObject = { variableName:"name", a:100.2 ,b:true};
	var returnValue = null;
	
	returnValue = readObjectLiteralValue(testObject, "variableName");
	if(returnValue !== testObject.variableName){
		errorCode += "readObjectLiteralValue isn't working for strings.\r";
	}

	returnValue = readObjectLiteralValue(testObject, "a");
	if(returnValue !== testObject.a){
		errorCode += "readObjectLiteralValue isn't working for numbers.\r";
	}
	returnValue = readObjectLiteralValue(testObject, "b");
	if(returnValue !== testObject.b){
		errorCode += "readObjectLiteralValue isn't working for booleans.\r";
	}
	
}





