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

function ShowArticles(articles, params) {
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
		articleDiv.innerHTML = "<h2>" + article.title + "</h2>" + "<p>" + article.labels + "</p>";
		articlesDiv.appendChild(articleDiv);
	}
}

function ShowLabels(labels, params) {
	var labelsDiv = document.getElementById("labelList");
	for (var i = 0; i < labels.length; i++) {
		var label = labels[i];
		var labelDiv = document.createElement("div");
		labelDiv.innerHTML = "<h2>" + label.title + "</h2>";
		labelDiv.innerHTML += "<p> contains " + label.articles.length + "article(s) </p>";
		labelsDiv.appendChild(labelDiv);
	}
}