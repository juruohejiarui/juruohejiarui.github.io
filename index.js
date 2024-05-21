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

	loadJSON("articles.json", showArticles, params);

	curPageId = params.pageId;
	curLabel = params.label;
}

curLabel = null;
curPageId = 0;

function showArticles(articles, params) {
	var articlesDiv = document.getElementById("articleList");
	list = [];
	for (var i = 0; i < articles.length; i++) {
		var article = articles[i];
		var hasLabel = false;
		if (params.label != null) {
			for (var j = 0; j < article.labels.length; j++)
				if (article.labels[j] == params.label) {
					hasLabel = true;
					break;
				}
		} else hasLabel = true
		if (hasLabel) list.push(article);
	}
	list.sort(function(a, b) {
		return a.updateTime > b.updateTime ? -1 : 1;
	});
	if (params.pageId * 10 >= list.length) params.pageId = Math.floor(list.length / 10.0);
	for (var i = params.pageId * 10; i < Math.min((params.pageId * 10 + 10, articles.length)); i++) {
		var article = list[i];
		var articleDiv = document.createElement("div");
		articleDiv.className = "article-list-element";
		articleUrl = "article.html?path=" + encodeURIComponent(article.file);
		innerHTML = "<a class=\"article-list-element-title\" href=\"" + articleUrl + "\">" + article.title + "</a>"
		innerHTML += "<div>"
		for (var j = 0; j < article.labels.length; j++) {
			href = "index.html?label=" + article.labels[j];
			innerHTML += "<a class=\"href\" href=\"" + href + "\">" + article.labels[j] + "</a>"
		}
		innerHTML += "</div>"
		articleDiv.innerHTML = innerHTML;
		articlesDiv.appendChild(articleDiv);
	}
}

function nextPage() {
	if (curLabel != null) 
		window.location.assign("index.html?label=" + curLabel + "&pageId=" + (curPageId + 1));
	else
		window.location.assign("index.html?pageId=" + (curPageId + 1));
}

function prevPage() {
	if (curLabel != null) 
		window.location.assign("index.html?label=" + curLabel + "&pageId=" + Math.max(0, curPageId - 1));
	else 
		window.location.assign("index.html?pageId=" + Math.max(0, curPageId - 1));
}