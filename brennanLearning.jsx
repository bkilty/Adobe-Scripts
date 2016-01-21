#include "importPropertyListings.jsx"
#include "listingElements.jsx"

var myDocument = app.activeDocument;
//var myDocument = app.documents.item(0);
var myPage = myDocument.pages.item(0);
var myPageWidth = myDocument.documentPreferences.pageWidth;
var myPageHeight = myDocument.documentPreferences.pageHeight;
//var myMargins = 3;
var myTextFrameArray = [];
var i = 0;
var myData = null;

myData = getPropertyListings();

//set the folder to get propertyimages from
var projectFolder = "C:/TheBroker/^AutomatedBrokerTesting/";


// Get the current property listings that are in the active document
var propertiesLayer = myDocument.layers.itemByName("Text and Images");
var existingPageItem = propertiesLayer.allPageItems;
var existingPropertyIndex = [];
var existingPropertyData = [];
var existingLabel = [];
var nProp = 0; //count the number of property elements in the current document
for(var i = 0; i < existingPageItem.length; i++){
	if(readVisibleLabelVariable(existingPageItem[i],"objType") === "propertyListing")
	{
		nProp++;
		existingPropertyIndex[nProp-1] = i;
		existingPropertyData[nProp-1] = getDataFromHiddenLabel(existingPageItem[i],"propertyData");
	}
	
}


//determine properties to be deleted
var modifyIndexObjArray = []; // index of properties
var deleteIndex = [];
var newIndex = [];

var workIndexNew = []; // an array of objects that track what needs to be done on the objects created from myData
var workIndexExisting = []; //track the index of the existing PageItem that matches indexed according to the workIndexNew array
for(var i = 0; i < myData.propertyListing.length; i++) //intialize the array
{
	workIndexNew[i] = true; // until we know different, assume all are new
	workIndexExisting[i] = null;
}
	
// for each existing property see if it is listed in the myData object array
for(var i = 0; i < nProp; i++){
	//matchArray = searchArrayOfObjects(objectArray, variableName, value)
	var matchArray = searchArrayOfObjects(myData.propertyListing, "id", existingPropertyData[i]["id"]);
	//if length = 0 --> delete property
	//if length = 1 --> modify property
	switch(matchArray.length){
		case 0: 
			deleteIndex.push(i); // add the current existingPropertyData index to the delete index
			break;
		case 1: 
			workIndexNew[matchArray[0]] = false; // there is a matching property ID therefore its not new
			workIndexExisting[matchArray[0]] = i ; //track the index of the existing PageItem that matches 
			break;
		default:
			alert("Duplicates found for a property " + existingPropertyData[i]["id"]);
	}

}



//Get the listing margins
var myMarginPreferences = app.activeWindow.activePage.marginPreferences;
var listingSpaceBounds = {
    left : myMarginPreferences.left,
    right: (myPageWidth - myMarginPreferences.right),
    top: myMarginPreferences.top,
    bottom: (myPageHeight - myMarginPreferences.bottom)
    };
var gutter = myMarginPreferences.columnGutter;

//Find the page the ad space starts on
var adBoundLayer = myDocument.layers.itemByName("AdBounds");
var existingAdBound = adBoundLayer.allPageItems;
for( i = 0; i<existingAdBound.length; i++){
	if(existingAdBound[i].label === "adNewman"){
		listingSpaceBounds = {
    left : existingAdBound[i].geometricBounds[1],
    right: existingAdBound[i].geometricBounds[3],
    top: existingAdBound[i].geometricBounds[0],
    bottom: existingAdBound[i].geometricBounds[2]
    };
		
	}
}

		
/*
//refine the margins for listings according to the header element
var manualPlacementLayer = myDocument.layers.itemByName("ManualObjectPlacement");
var existingPageItem = manualPlacementLayer.allPageItems;
var myCurrentPageItems = myPage.allPageItems;
var myArrayLength = myCurrentPageItems.length;

for( i = 0; i<myArrayLength; i++){
	if(myCurrentPageItems[i].label === "Newman_Header_1"){
		myCurrentPageItems[i].label = "Newman_Header_1";
		var Bound = myCurrentPageItems[i].geometricBounds;
		//note: [y,x] is the coordinate formate [yTL,xTL,yBR,xBR]
		var width = Bound[3] - Bound[1];
		var height = Bound[2] - Bound[0];
		
		//which side of the header should listings go?
		
		if(Bound[0] - listingSpaceBounds.top > listingSpaceBounds.bottom - Bound[2])
		{ //put listings above the header
			listingSpaceBounds.bottom = Bound[0] - gutter;
			}
		else{
			//put the listings below the header
			listingSpaceBounds.top = Bound[2]+ gutter;
			}
		
	} 


}
*/

/*
//FIND THE Designated Ad Space
var adLayer = myDocument.layers.itemByName("AdMargins");
var adIndex = [];
var adSpaceCount = 0; // multipage ads will have multiple adSpaces to index
var adName = "adNewman";
var ads = adLayer.allPageItems; 
//scan the array for the matching object
for(var i = 0; i < ads.length;i++){
	
	if(ads[i] === adName){
		adIndex[adSpaceCount++] = i;
	}
}

if(adIndex.length === 0)
{
	alert("Ad " + adName + " not found, would you like to add a new page?");
}

var adPages = []; //what page numbers contain the designated ad space

for( var i = 0; i<adIndex.length; i++){}


myCurrentPageItems[i].label === "Newman_Header_1"

*/



	
/*
docMargins.right = myPageWidth - myMargins;
docMargins.bottom = myPageHeight - myMargins;
*/

usableWidth = listingSpaceBounds.right - listingSpaceBounds.left;
usableHeight = listingSpaceBounds.bottom - listingSpaceBounds.top;




var myColumns = 4;
var myRows =4;

//var gutter = 0.25;

var boxWidth = (usableWidth - (myColumns-1)*gutter)/myColumns;
var boxHeight = (usableHeight - (myRows-1)*gutter)/myRows;

/*
var myTextFrame = myPage.textFrames.add();
myTextFrame.geometricBounds = [12,12,45,45];//yTopLeft,xTopLeft,yBottomRight,xBottomRIght
//myTextFrame.contents = boxWidth+ ", " + boxHeight;
myTextFrame.contents = docMargins.left + "," + docMargins.top + "," + docMargins.right +","+ docMargins.bottom;
*/

/*
var myRectangle = myPage.rectangles.add({geometricBounds:[5,5,15,25]});

var imageFile = new File('C:/TheBroker/TheBrokerSourceMaterial/201512SourceMaterial/BearMountainLand/000_0254.jpg');
var myRectangleImage = myRectangle.place(imageFile,false);
myRectangle.fit(FitOptions.FILL_PROPORTIONALLY);

var myRectangleText = myRectangle.textFrames.add({geometricBounds:[6,6,14,24]});
myRectangleText.contents = "testing";
var myAgencyID = "BearMtn";
var myItemID = "1";
myRectangle.insertLabel("Image", myAgencyID+myItemID);
myRectangleText.label = "Text_" + myAgencyID + myItemID;


myRectangleText.contents = myRectangleText.label;
*/

//var myTestTextFrame = myRectangle.PageItem

//myRectangleText.contents = "testing";

var topX = 0;
var topY = 0;
var bottomX = 0;
var bottomY = 0;

var myPropertyCount = 0;
var myCurrentPropertyData = null;
var myCurrentPropertyGroup = null;
var myPropertyElementsArray = [];


var myPropertyImage = null;
var myPropertyImagePath = null;
var bannerRef = null;

var myPropertyTextFrame = null;

var propertyBounds = [];
var imageBounds = [];
var textBounds = [];
var bannerBounds = [];

var foo = null; // temporary variable to send values to alert
var existingProperties = [];// testing if I can go back and forth between string and object


//myDocument.layers.add();
var currentLayer = myDocument.layers.itemByName("Text and Images");



//place the property on the page
for (var i = 0; i < myRows; i++){
    for ( var j = 0; j<myColumns; j++){
		
		//initialize variables for this property
		var myPropertyElement = [];
		var noImageFlag = false;
		var elementCount = 0;
		var matches = [];
		myCurrentPropertyData = myData.propertyListing[myPropertyCount];
		
		//calculate the geometric bounds of the listing
			topY = listingSpaceBounds.top + (boxHeight + gutter)*i;
			topX = listingSpaceBounds.left + (boxWidth + gutter)*j; 
			bottomY = topY + boxHeight;
			bottomX = topX + boxWidth;  
			//set the Geometric Bounds
			propertyBounds = [topY, topX, bottomY, bottomX];
				
			imageBounds = [topY, topX, bottomY - boxHeight/2, bottomX];
			textBoxBounds = [bottomY - boxHeight/2, topX , bottomY, bottomX];
			bannerBounds = [topY, topX, topY+boxHeight/4, topX+ boxWidth/4];
			
		
		if(myPropertyCount < myData.propertyListing.length && matches.length === 0 ){
			
			var changeElement = {newProp: true, image: true, text: true, banner: true}; //assume new and that everything needs changed
			
			var iExist = null;
			
			if(!workIndexNew[myPropertyCount]) // the object is not new -- it already exists -- does it need to change or can it remain the same?
			{
				changeElement.newProp = false; // not a new property
				
				//determine how the property listing has changes (if at all)
				iExist = workIndexExisting[myPropertyCount]; //index of matching  existingPropertyData object
			
				//what has changed (Image, text, price, contact, etc...)
				var vName = ["title","description","price","contact","status","image"]; //note, it would be better if this wasn't a fixed array
				var name = null;
				var changeObj = {};
				var bObjChange = false;
				
								
				for(var n in vName){
					name = vName[n];
					if(existingPropertyData[iExist][name] === myData.propertyListing[myPropertyCount][name]){
						changeObj[name] = false;
					}else{
						changeObj[name] = true;
						bObjChange = true;
					}
				}
				
				if(bObjChange){
					//change the object approriately
					if(changeObj.title || changeObj.price || changeObj.contact || changeObj.description){
						//change the text
						changeElement.text = true;
					}else{ 
						changeElement.text = false; 
					}
					
					if(changeObj.status){
						//add, change, or remove banner
						changeElement.banner = true;
					}else{ 
						changeElement.banner = false; 
					}
					
					if(changeObj.image){
						changeElement.image = true;
					}else{ 
						changeElement.image = false; 
					}
						
				}
			}
			
			
			if(changeElement.newProp === false) // existing property -- we will probably need to move, maybe resize, and maybe change text, image,  and or banner
			{	
				//get the corresponding page item index
				var pageItemIndex = existingPropertyIndex[iExist]; //holds the index of the page item corresponding to a current existingPropertyDataObject
				
				storeDataInHiddenLabel(existingPageItem[pageItemIndex],"propertyData", myData.propertyListing[myPropertyCount]); //update the property data stored on the propertyListing Object
				
				
				//move it to the current location
				existingPageItem[pageItemIndex].move([propertyBounds[1],propertyBounds[0]]);
				
				//resize?
				
				//change text?
				//var existingPageItem = propertiesLayer.allPageItems;
				var pageItemType = readVisibleLabelVariable(existingPageItem[pageItemIndex], "pageItemType");
				
				if(pageItemType === "group")
				{
					// get items in the group
					var existingListingItems = existingPageItem[pageItemIndex].allPageItems; //get all of the elements in the group
					
					for(var ig = 0; ig < existingListingItems.length; ig++){
						
						if((readVisibleLabelVariable(existingListingItems[ig], "pageItemType") === "text") && changeElement.text){
							existingListingItems[ig].contents = myCurrentPropertyData.title + "\r" +  myCurrentPropertyData.description + "\r" +  myCurrentPropertyData.price + "\t" +  myCurrentPropertyData.contact;
						}
					
						if((readVisibleLabelVariable(existingListingItems[ig], "pageItemType") === "image") && changeElement.image){
							myPropertyImagePath = projectFolder + "IMAGES/" + myCurrentPropertyData.image + ".jpg"; //path to the image
							existingListingItems[ig].place(myPropertyImagePath, false, {geometricBounds: imageBounds});
						}
					}
				}else if(pageItemType === "text"){
					existingPageItem[pageItemIndex].contents = myCurrentPropertyData.title + "\r" +  myCurrentPropertyData.description + "\r" +  myCurrentPropertyData.price + "\t" +  myCurrentPropertyData.contact;
				}
					
			}
							
			if(changeElement.newProp === true) // new property
			{	
				//add the property image
				if(myData.propertyListing[myPropertyCount].image === ""){
					textBoxBounds = propertyBounds;
					noImageFlag = true;
				}
										
				if(!noImageFlag){  //there is no image to place, so skip this block
					myPropertyImagePath = projectFolder + "IMAGES/" + myCurrentPropertyData.image + ".jpg"; //path to the image
					myPropertyElement[elementCount] = myPage.rectangles.add(currentLayer);
					myPropertyElement[elementCount].geometricBounds = imageBounds;
					myPropertyElement[elementCount].place(myPropertyImagePath, false, {geometricBounds: imageBounds});
					encodeVisibleLabel(myPropertyElement[elementCount], "pageItemType","image");
					elementCount++;
				}
				
				//Place the property Text
				myPropertyElement[elementCount] = myPage.textFrames.add(currentLayer);
				myPropertyElement[elementCount].geometricBounds = textBoxBounds;			
				//set the TextFrams's label property so that we can find it later
				encodeVisibleLabel(myPropertyElement[elementCount], "pageItemType","text");
				myPropertyElement[elementCount].contents = myCurrentPropertyData.title + "\r" +  myCurrentPropertyData.description + "\r" +  myCurrentPropertyData.price + "\t" +  myCurrentPropertyData.contact;
				
				//Place any banners
				if(myCurrentPropertyData.status !== "forSale" )
				{
					elementCount++;
					bannerRef = projectFolder + "GRAPHICS/" + "sold.ai";
					myPropertyElement[elementCount] = myPage.rectangles.add(currentLayer);
					myPropertyElement[elementCount].geometricBounds = bannerBounds;
					myPropertyElement[elementCount].place(bannerRef, false);
					myPropertyElement[elementCount].fit(FitOptions.PROPORTIONALLY);
					encodeVisibleLabel(myPropertyElement[elementCount], "pageItemType","banner");
					
				}
				
				if(elementCount > 0){
					myPropertyGroup = myPage.groups.add(myPropertyElement);
					storeDataInHiddenLabel(myPropertyGroup,"propertyData", myData.propertyListing[myPropertyCount]);
					myPropertyGroup.label = "test";
					encodeVisibleLabel(myPropertyGroup, "objType","propertyListing");
					encodeVisibleLabel(myPropertyGroup, "pageItemType","group");
					encodeVisibleLabel(myPropertyGroup, "id",myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id );
								
				}else{ //Text Only object
						myPropertyElement[elementCount].label = "automated, " + myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id;
						storeDataInHiddenLabel(myPropertyElement[elementCount], "propertyData", myData.propertyListing[myPropertyCount]);
						encodeVisibleLabel(myPropertyElement[elementCount], "objType","propertyListing");
						encodeVisibleLabel(myPropertyElement[elementCount], "pageItemType","text");
						encodeVisibleLabel(myPropertyElement[elementCount], "id",myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id );
				}
			
			} // end of new property block
			
			
				
		
		}
		myPropertyCount++;
	}//end of  nested for loop

//now lets read the property data from the file

}
