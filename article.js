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
	makeHeaderList();
	windowSizeChange();
}

window.onresize = windowSizeChange;

function showArticleInfo(articleInfo, params) {
	title = document.getElementById("title");
	title.innerHTML = articleInfo.title;
	document.title = articleInfo.title;
}

function windowSizeChange() {
	var contentDiv = document.getElementById("content");
	const windowSize = { width: window.innerWidth, height: window.innerHeight };
	if (windowSize.height > windowSize.width)
		contentDiv.style.margin = "0px";
	else {
		contentDiv.style.margin = "0px 10% 0px 10%";
	}
}

function makeHeaderList() {
	// scan recursively to find all headers
	var headers = document.body.querySelectorAll("h1, h2, h3, h4, h5, h6");
	 
}