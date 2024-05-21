window.onload = function() {
	var params = {};
	params.pageId = null;
	params.label = null;
	
	// get parameters from url
	var searchParams = new URLSearchParams(window.location.search);
	if (searchParams.has("label")) params.label = searchParams.get("label");
	if (searchParams.has("pageId")) params.pageId = searchParams.get("pageId");

	if (params.pageId == null) params.pageId = 0;
	else params.pageId = parseInt(params.pageId);

	loadJSON("articles.json", ShowArticles, params);
}