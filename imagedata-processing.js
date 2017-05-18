function getColourPalette(imageDataArray, loadDeferred) {
	var paletteColours = [];
	
	var currentImageData;
	var currentRGBA;
	for(var i = 0; i < imageDataArray.length; i++) {
		// iterate each ImageData.data array
		currentImageData = imageDataArray[i];
		console.log(currentImageData);
		for(var n = 0; n < currentImageData.data.length; n += 4) {
			// get RGBA values and add them to the palette array if a matching object isn't already inside
			currentRGBA = {
				r: currentImageData.data[n],
				g: currentImageData.data[n + 1],
				b: currentImageData.data[n + 2],
				a: currentImageData.data[n + 3]
			};
			if(!isColourInArray(currentRGBA, paletteColours))
				paletteColours.push(currentRGBA);
		}
		if(i + 1 === imageDataArray.length)
			loadDeferred.resolve();
	}
	return paletteColours;
}
function isColourInArray(rgbaObject, colourArray) {
	var colour;
	for(var i = 0; i < colourArray.length; i++) {
		colour = colourArray[i];
		// if all colour components match, these are the same colour (i.e. the array already contains that colour)
		if(rgbaObject.r === colour.r && rgbaObject.g === colour.g && rgbaObject.b === colour.b && rgbaObject.a === colour.a)
			return true;
	}
	return false;
}