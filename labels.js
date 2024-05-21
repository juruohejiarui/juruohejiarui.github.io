window.onload = function() {
	var params = {}
	params.pageId = null;
	params.label = null;
	
	// get parameters from url
	var searchParams = new URLSearchParams(window.location.search);
	if (searchParams.has("pageId")) params.pageId = searchParams.get("pageId");
	if (params.pageId == null) params.pageId = 0;
	else params.pageId = parseInt(params.pageId);

	loadJSON("labels.json", showLabels, params);

	curPageId = params.pageId;
}

curPageId = 0;

function showLabels(labels, params) {
	var labelsDiv = document.getElementById("labelList");
	if (params.pageId * 10 >= labels.length) params.pageId = Math.floor(labels.length / 10.0);
	for (var i = params.pageId * 10; i < Math.min((params.pageId * 10 + 10, labels.length)); i++) {
		var label = labels[i];
		var labelDiv = document.createElement("div");
		labelDiv.innerHTML = "<h2>" + label.name + "</h2>";
		labelDiv.innerHTML += "<p> contains " + label.articles.length + " article(s) </p>";
		labelsDiv.appendChild(labelDiv);
	}
}

function nextPage() {
	window.location.assign("labels.html?pageId=" + (curPageId + 1));
}

function prevPage() {
	window.location.assign("labels.html?pageId=" + Math.max(0, curPageId - 1));
}