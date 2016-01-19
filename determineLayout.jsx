function getListingLayout(adBounds, gutterSize, keepOutElements)
{
	var read_file = File (File.openDialog("Open Data File", "*.json",false));
	var myJSONObject = null;
	var myContent = ""; //get the file text
	
	if(!read_file.open('r')){
		alert("File was not opened");
		}
	else{
		myContent = read_file.read();
		myJSONObject = JSON.parse(myContent);
		//alert(myJSONObject.toSource());
		read_file.close();
		}
	
	return myJSONObject;
	}