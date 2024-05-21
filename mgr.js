function loadJSON(path, action) {
	var url = path;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.send(null);
	xhr.onload = function() {
		if (xhr.status == 200)
			action(JSON.parse(xhr.responseText));
	};
}

function ShowArticles(articles) {
	var articlesDiv = document.getElementById("articleList");
	for (var i = 0; i < articles.length; i++) {
		var article = articles[i];
		var articleDiv = document.createElement("div");
		articleDiv.innerHTML = "<h2>" + article.title + "</h2>";
		articlesDiv.appendChild(articleDiv);
	}
}