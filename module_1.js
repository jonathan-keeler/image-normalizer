(function () {
	$(document).ready(function() {
		var palette_urls = []; // holds palette file URLs
		var alter_urls = []; // holds image URLs to be normalized
		
		$("#clickable").click(function() {
			alert("Text: " + $("#hidden").text());
		});
		$("#palette-upload").change(function() {
			palette_urls.length = 0;
			console.log(this.files);
			var filesLoaded = $.Deferred();
			loadFiles(this.files, 0, filesLoaded, palette_urls); // hopefully resolves filesLoaded
			filesLoaded.done(function(data) {
				// urls have been successfully loaded, okay to continue
				console.log("palette urls length: " + palette_urls.length);
				showPaletteImages($("#palette-preview")); // show all uploaded images in the preview
				var imageDataLoaded = $.Deferred();
			});
			filesLoaded.fail(function(ex) {
				alert("problem loading files: " + ex);
			});
		});
		// recursive function that loads all files with a promise attached (allLoaded)
		function loadFiles(fileArray, fileIndex, allLoaded, urlArray) {
			var currentLoaded = getURLandPush(fileArray[fileIndex], urlArray);
			currentLoaded.done(function() {
				// recursively iterate through the files
				if(fileArray[fileIndex + 1] !== undefined) {
					loadFiles(fileArray, fileIndex + 1, allLoaded, urlArray);
				} else {
					console.log("All files loaded, resolve() call upcoming");
					allLoaded.resolve(fileIndex); // resolve deferred once all files are loaded
				}
			});
		}
		// get dataurl from uploaded file and push it to the given array
		function getURLandPush(file, storageArray) {
			var deferred = $.Deferred();
			
			var reader = new FileReader();
			
			reader.onload = (function(event) {
				return function(e) {
					// append URL to array
					console.log(e.target.result);
					storageArray.push(e.target.result);
					deferred.resolve();
				};
			})(file);
			reader.readAsDataURL(file);
			
			return deferred.promise();
		}
		function showPaletteImages(htmlElement) {
			htmlElement.empty();
			for(var i = 0; i < palette_urls.length; i++) {
				// insert all images into the preview
				$("<img/>", {
					id: 'palette-image',
					src: palette_urls[i],
					height: '200'
				}).appendTo("#palette-preview");
			}
		}
		function loadAllImageData(urlIndex, allLoaded) {
			
		}
		function urlToData(url, storageArray) {
			var deferred = $.Deferred();
			
			
			
			return deferred.promise();
		}
	});
})();