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


//determine if the updatedListings are new or updates

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
		
		//check to see if the element is already on the page
		if(myPropertyCount < myData.propertyListing.length && existingPropertyData.length > 0){
			matches = searchArrayOfHiddenLabels(existingPropertyData, "id", myData.propertyListing[myPropertyCount].id);			
		}
		
		
		if(myPropertyCount < myData.propertyListing.length && matches.length === 0 ){
			//calculate the geometric bounds of the text box
			topY = listingSpaceBounds.top + (boxHeight + gutter)*i;
			topX = listingSpaceBounds.left + (boxWidth + gutter)*j; 
			bottomY = topY + boxHeight;
			bottomX = topX + boxWidth;  
			//set the Geometric Bounds
			propertyBounds = [topY, topX, bottomY, bottomX];
			
			imageBounds = [topY, topX, bottomY - boxHeight/2, bottomX];
			textBoxBounds = [bottomY - boxHeight/2, topX , bottomY, bottomX];
			bannerBounds = [topY, topX, topY+boxHeight/4, topX+ boxWidth/4];
						
			
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
				myPropertyElement[elementCount].label = myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id + "_image";
				elementCount++;
			}
			
			//Place the property Text
			myPropertyElement[elementCount] = myPage.textFrames.add(currentLayer);
			myPropertyElement[elementCount].geometricBounds = textBoxBounds;			
			//set the TextFrams's label property so that we can find it later
			myPropertyElement[elementCount].label = myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id + "_text"; 
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
				//myPropertyElement[elementCount].label = myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id + "_banner";
				
			}
			
			if(elementCount > 0){
				myPropertyGroup = myPage.groups.add(myPropertyElement);
				storeDataInHiddenLabel(myPropertyGroup,"propertyData", myData.propertyListing[myPropertyCount]);
				myPropertyGroup.label = "test";
				encodeVisibleLabel(myPropertyGroup, "objType","propertyListing");
				encodeVisibleLabel(myPropertyGroup, "id",myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id );
				
				
				
				
			}else{ //Text Only object
					myPropertyElement[elementCount].label = "automated, " + myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id;
					storeDataInHiddenLabel(myPropertyElement[elementCount], "propertyData", myData.propertyListing[myPropertyCount]);
					encodeVisibleLabel(myPropertyElement[elementCount], "objType","propertyListing");
					encodeVisibleLabel(myPropertyElement[elementCount], "id",myData.propertyListing[myPropertyCount].agency + myData.propertyListing[myPropertyCount].id );
				
			}
		
		}
		myPropertyCount++;
	}//end of  nested for loop

//now lets read the property data from the file

}
