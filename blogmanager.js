var BlogLinkElement = new Array();
var BlogLinkListElement = new Array();
var LabelDictionary = new Array();
function BuildBlogContentHtml(ContentElement, path) {
    fetch(path)
        .then(response => response.text())
        .then(text => ContentElement.innerHTML = text);
}



function BuildBlogLabelsHtml(info, id) {
    function BuildSingleHtml(name) {
        return "<button class=\"bloglink-label\" onclick=\"ShowLabel(\'" + name + "\')\">"
                + name
            + "</button>";
    }
    var res = "";
    for (var i = 0; i < info.Labels.length; i++) {
        res += BuildSingleHtml(info.Labels[i]) + "&nbsp;";
        if (LabelDictionary[info.Labels[i]] == null)
            LabelDictionary[info.Labels[i]] = new Array(); 
            LabelDictionary[info.Labels[i]].push(id);
    }
    return res;
}
function BuildBlogTitleHtml(info, id, page) {
    var lbl_html = BuildBlogLabelsHtml(info),
        time_html = "<div class=\"bloglink-time\">" + info.Time + "</div>",
        title_html = "<div class=\"bloglink-title\">" + info.Title + "</div>",
        shcut_html = "<div class=\"bloglink-shortcut\">" + info.ShortCut + "</div>",
        res = "";
    res = "<div class=\"bloglink\">"
        +   "<div class=\"bloglink-content\" onclick=\"ShowBlog(" + id.toString() + ",\'list$" + page.toString() + "\')\">"
        +       title_html
        +       shcut_html
        +       time_html
        +   "</div>"
        +   "<div class=\"bloglink-actions\">"
        +       lbl_html
        +   "</div>"
        + "</div>";
    return res;
}
function BuildSearchTree() {
    
}
function Search(keyword) {

}