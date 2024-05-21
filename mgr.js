function loadJSON(path, action, params) {
	var url = path;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send(null);
	xhr.onload = function() {
		if (xhr.status == 200)
			action(JSON.parse(xhr.responseText), params);
	};
}