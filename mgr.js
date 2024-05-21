function loadJSON(path) {
	var url = "articles.json";
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send(null);
	var res = null;
	xhr.onload = function() {
		if (xhr.status == 200)
			res = JSON.parse(xhr.responseText);
	};
	return res
}
function loadArticles() {
	var articles = loadJSON("articles.json");
	var articlesDiv = document.getElementById("articles");
	for (var i = 0; i < articles.length; i++) {
		var article = articles[i];
		var articleDiv = document.createElement("div");
		articleDiv.className = "article";
		articleDiv.innerHTML = "<h2>" + article.title + "</h2>";
		articlesDiv.appendChild(articleDiv);
	}
}