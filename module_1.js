(function () {
	$(document).ready(function() {
		var urls = []; // holds file URLs
		
		$("#clickable").click(function() {
			alert("Text: " + $("#hidden").text());
		});
		$("#palette-upload").change(function() {
			/*
			urls.length = 0; // clear urls on upload
			console.log(this.files);
			var urlPromise = getURLs(this.files);
			urlPromise.done(function(data) { // data resolved
				console.log(data);
				console.log("TEST data");
				console.log(urls);
				console.log(urls[0]);
			});
			urlPromise.fail(function(ex) {
				alert("problem occured: " + ex);
			});
			*/
			// call getURLs and when finished, run the enclosed code
			//getURLs(this.files).promise().done(function() {
			//	console.log(fileURLs.length);
			//	for(var i = 0; i < fileURLs.length; i++) {
			//		console.log(fileURLs[i]);
			//	}
			//});
			urls.length = 0;
			console.log(this.files);
			var filesLoaded = $.Deferred();
			loadFiles(this.files, 0, filesLoaded); // hopefully resolves filesLoaded
			filesLoaded.done(function(data) {
				// urls have been successfully loaded, okay to continue
				console.log("URL length: " + urls.length);
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
					allLoaded.resolve(fileIndex);
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
		function getURLs(fileArray) {
			var deferred = $.Deferred();
			
			urls = []; // make new empty array
			
			// weirdness: a unique FileReader has to be declared with .onload defined for every image
			for(var i = 0, f; f = fileArray[i]; i++) {
				var reader = new FileReader();
				
				// callled by readAsDataURL();
				// function enclosure/generator is used due to declaration inside a loop problem
				reader.onload = (function(event) {
					return function(e) {
						// append URL to array
						console.log("TEST");
						urls.push(e.target.result);
					};
				})(f);
				reader.readAsDataURL(fileArray[i]); // run the above function for each file
				if(fileArray[i+1] === undefined)
					deferred.resolve(i+1);
			}
			return deferred.promise();
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