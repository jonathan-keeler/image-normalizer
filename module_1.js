(function () {
	$(document).ready(function() {
		var urls = []; // holds palette file URLs
		
		$("#clickable").click(function() {
			alert("Text: " + $("#hidden").text());
		});
		$("#palette-upload").change(function() {
			urls.length = 0;
			console.log(this.files);
			var filesLoaded = $.Deferred();
			loadFiles(this.files, 0, filesLoaded); // hopefully resolves filesLoaded
			filesLoaded.done(function(data) {
				// urls have been successfully loaded, okay to continue
				console.log("URL length: " + urls.length);
				showPaletteImages($("#palette-preview")); // show all uploaded images in the preview
				$("#palette-preview").html("<img src='"+urls[0]+"' height='200' />");
			});
			filesLoaded.fail(function(ex) {
				alert("problem loading files: " + ex);
			});
		});
		// recursive function that loads all files with a promise attached
		function loadFiles(fileArray, fileIndex, allLoaded) {
			
			var currentLoaded = getURLandPush(fileArray[fileIndex]);
			currentLoaded.done(function() {
				// recursively iterate through the files
				if(fileArray[fileIndex + 1] !== undefined) {
					loadFiles(fileArray, fileIndex + 1, allLoaded);
				} else {
					console.log("All files loaded, resolve() call upcoming");
					allLoaded.resolve(fileIndex); // resolve deferred once all files are loaded
				}
			});
		}
		function getURLandPush(file) {
			var deferred = $.Deferred();
			
			var reader = new FileReader();
			
			reader.onload = (function(event) {
				return function(e) {
					// append URL to array
					console.log(e.target.result);
					urls.push(e.target.result);
					deferred.resolve();
				};
			})(file);
			reader.readAsDataURL(file);
			
			return deferred.promise();
		}
		function showPaletteImages(htmlElement) {
			//for(var i = 0; i < urls.length; i++) {
			//	imageHtml = imageHtml.concat('<img src="' + urls[i] + '" height="200" />');
			//	if(i < urls.length - 1)
			//		imageHtml = imageHtml.concat('\n');
			//}
			for(var i = 0; i < urls.length; i++) {
				// insert all images into the preview
				$("<img/>", {
					id: 'palette-image',
					src: urls[i],
					height: '200'
				}).appendTo("#palette-preview");
			}
			console.log(imageHtml);
			htmlElement.html(imageHtml);
		}
		function renderPaletteList(fileArray) {
			var reader = new FileReader();
			
			var paletteHtml = "";
			
			reader.onload = function(event) {
				the_url = event.target.result;
				$("#palette-preview").html("<img src='" + the_url + "' height='200' />");
			};
			
			// trigger the onload function above
			reader.readAsDataURL(file);
			
			// write in the html 
			$("#palette-preview").html(paletteHtml);
		};
	});
})();