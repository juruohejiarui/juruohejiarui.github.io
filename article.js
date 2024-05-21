window.onload = function() {
	var params = {}
	params.path = null;
	
	// get parameters from url
	var searchParams = new URLSearchParams(window.location.search);
	if (searchParams.has("path")) params.path = searchParams.get("path");
	params.path = "articles/" + decodeURIComponent(params.path);

	if (params.path == null) return ;
	loadJSON(params.path, showArticleInfo, params);

	contentDiv = document.getElementById("content");
	fetch(params.path).then(response => response.text()).then(text => {
		contentDiv.innerHTML = text;
	});
}

function showArticleInfo(articleInfo, params) {
	title = document.getElementById("title");
	title.innerHTML = articleInfo.title;
	document.title = articleInfo.title;
}