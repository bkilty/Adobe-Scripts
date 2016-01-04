var myDocument = app.activeDocument;
//var myDocument = app.documents.item(0);
var myPage = myDocument.pages.item(0);
var myPageWidth = myDocument.documentPreferences.pageWidth;
var myPageHeight = myDocument.documentPreferences.pageHeight;
//var myMargins = 3;
var myTextFrameArray = [];
/*
docMargins.right = myPageWidth - myMargins;
docMargins.bottom = myPageHeight - myMargins;
*/
var myMarginPreferences = app.activeWindow.activePage.marginPreferences;
var docMargins = {
    left : myMarginPreferences.left,
    right: myMarginPreferences.right,
    top: myMarginPreferences.top,
    bottom:myMarginPreferences.bottom
    };
var gutter = myMarginPreferences.columnGutter;

usableWidth = myPageWidth - (docMargins.left+docMargins.right);
usableHeight = myPageHeight - (docMargins.top+docMargins.bottom);


var myColumns = 4;
var myRows =4;

//var gutter = 0.25;

var boxWidth = (usableWidth - (myColumns-1)*gutter)/myColumns;
var boxHeight = (usableHeight - (myRows-1)*gutter)/myRows;

var myTextFrame = myPage.textFrames.add();
myTextFrame.geometricBounds = [3,12,45,45];//yTopLeft,xTopLeft,yBottomRight,xBottomRIght
//myTextFrame.contents = boxWidth+ ", " + boxHeight;
myTextFrame.contents = docMargins.left + "," + docMargins.top + "," + docMargins.right +","+ docMargins.bottom;
var topX = 0;
var topY = 0;
var bottomX = 0;
var bottomY = 0;

var myRectangle = myPage.rectangles.add({geometricBounds:[5,5,15,25]});
//var myRectangleText = myRectangle.textFrames.add({geometricBounds:[6,6,14,24]};
myRectangle.contents = "testing";
myRectangle.label = "R1";

//myRectangleText.contents = "testing";

//set the bounds of the text frame
for (var i = 0; i < myRows; i++){
    for ( var j = 0; j<myColumns; j++){
        topY = docMargins.top + (boxHeight + gutter)*i;
        topX = docMargins.left + (boxWidth + gutter)*j;    
        
        myTextFrameArray[i+j] = myPage.textFrames.add();
        
        bottomY = topY + boxHeight;
        bottomX = topX + boxWidth;   
        
        myTextFrameArray[i+j] .geometricBounds = [topY, topX, bottomY, bottomX];
        myTextFrameArray[i+j] .contents = topX + " ";
    }
}
