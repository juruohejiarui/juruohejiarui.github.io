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

function ShowArticles(articles, pageId) {
	var articlesDiv = document.getElementById("articleList");
	list = [];
	for (var i = 0; i < articles.length; i++) {
		var article = articles[i];
		list.push(article);
	}
	list.sort(function(a, b) {
		return a.updateTime > b.updateTime ? -1 : 1;
	});
	if (pageId * 10 >= list.length) pageId = Math.floor(list.length / 10.0);
	for (var i = pageId * 10; i < Math.min((pageId * 10 + 10, articles.length)); i++) {
		var article = list[i];
		var articleDiv = document.createElement("div");
		articleDiv.innerHTML = "<h2>" + article.title + "</h2>" + "<p>" + article.labels + "</p>";
		articlesDiv.appendChild(articleDiv);
	}
}

function ShowLabels(labels) {
	var labelsDiv = document.getElementById("labelList");
	for (var i = 0; i < labels.length; i++) {
		var label = labels[i];
		var labelDiv = document.createElement("div");
		labelDiv.innerHTML = "<h2>" + label.title + "</h2>";
		labelsDiv.appendChild(labelDiv);
	}
}