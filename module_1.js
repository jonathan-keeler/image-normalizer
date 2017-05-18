(function () {
	$(document).ready(function() {
		var palette_urls = []; // holds palette file URLs
		var palette_data = []; // holds palette imagedata
		var palette_colours = []; // holds RGBA objects
		
		var alter_urls = []; // holds image URLs to be normalized
		
		$("#clickable").click(function() {
			alert("Text: " + $("#hidden").text());
		});
		$("#palette-upload").change(function() {
			palette_urls.length = 0;
			palette_data.length = 0;
			palette_colours.length = 0;
			console.log(this.files);
			var filesLoaded = $.Deferred();
			loadFiles(this.files, palette_urls, palette_data, 0, filesLoaded); // hopefully resolves filesLoaded
			filesLoaded.done(function(data) {
				// urls have been successfully loaded, okay to continue
				console.log("palette urls length: " + palette_urls.length);
				console.log("palette data length: " + palette_data.length);
				console.log(palette_data);
				showPaletteImages(); // show all uploaded images in the preview
				var imageDataLoaded = $.Deferred();
				// get palette colours and resolve imageDataLoaded from imagedata-processing.js
				palette_colours = getColourPalette(palette_data, imageDataLoaded);
				imageDataLoaded.done(function(data) {
					// palette has been loaded, render palette for user
					console.log("Palette has been successfully loaded!");
					console.log(palette_colours);
					showPaletteColours();
				});
			});
			filesLoaded.fail(function(ex) {
				alert("problem loading files: " + ex);
			});
		});
		// recursive function that loads all files with a promise attached (allLoaded)
		function loadFiles(fileArray, urlArray, dataArray, fileIndex, allLoaded) {
			var currentLoaded = getURLandPush(fileArray[fileIndex], urlArray, dataArray);
			currentLoaded.done(function() {
				// recursively iterate through the files
				if(fileArray[fileIndex + 1] !== undefined) {
					loadFiles(fileArray, urlArray, dataArray, fileIndex + 1, allLoaded);
				} else {
					console.log("All files loaded, resolve() call upcoming");
					allLoaded.resolve(fileIndex); // resolve deferred once all files are loaded
				}
			});
		}
		// get dataurl from uploaded file and push it to the given array
		function getURLandPush(file, urlArray, dataArray) {
			var deferred = $.Deferred();
			
			var reader = new FileReader();
			
			reader.onload = (function(event) {
				return function(e) {
					// append URL to array
					console.log(e.target.result);
					urlArray.push(e.target.result);
					
					// convert URL to ImageData
					var convertPromise = urlToData(e.target.result, dataArray);
					convertPromise.done(function() {
						// once URL has been properly converted, resolve the file as a whole
						console.log("URL conversion resolved");
						deferred.resolve();
					});
				};
			})(file);
			reader.readAsDataURL(file);
			
			return deferred.promise();
		}
		function urlToData(url, storageArray) {
			var deferred = $.Deferred();
			
			var img = new Image();
			img.src = url;
			img.onload = function() {
				// set up canvas and context
				var canvas = $("#processing-canvas").get(0);
				var ctx = canvas.getContext("2d");
				canvas.width = img.width;
				canvas.height = img.height;
				
				ctx.drawImage(img, 0, 0);
				img.style.display = "none";
				var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				storageArray.push(imageData);
				// clear canvas and resolve conversion promise
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				deferred.resolve();
			};
			
			return deferred.promise();
		}
		function showPaletteImages() {
			$("#palette-preview").empty();
			for(var i = 0; i < palette_urls.length; i++) {
				// insert all images into the preview
				$("<img/>", {
					id: 'palette-image',
					src: palette_urls[i],
					height: '200'
				}).appendTo("#palette-preview");
			}
		}
		function showPaletteColours() {
			$("#colours-preview").empty();
			// disallow displaying more than 500 colours (i.e. don't crash the browser)
			var max_preview = palette_colours.length;
			if(max_preview > 500) {
				max_preview = 500;
				$("#too-many-colours-header").get(0).style.display = 'inline-block';
			} else {
				$("#too-many-colours-header").get(0).style.display = 'none';
			}
			for(var i = 0; i < max_preview; i++) {
				// create colour preview boxes using the .colour-preview class
				$("<div/>", {
					id: 'colour-box',
					class: 'colour-preview',
					style: 'background: rgba(' + palette_colours[i].r + ',' + palette_colours[i].g + ',' + palette_colours[i].b + ',' + palette_colours[i].a + ');'
				}).appendTo("#colours-preview");
			}
		}
	});
})();