let BackgroundList = ["1.webp", "2.webp"];
var BlogLinkListElement = null;
var BlogList = null;
var OnShowElement = null;
let LastId = -1;

var NowPage = 0
function ChangeBackground() {
    var id = LastId;
    while (id == LastId)
        id = Math.floor(Math.random() * BackgroundList.length);
    LastId = id;
    document.body.background = "./Backgrounds/" + BackgroundList[id];
}

function LoadBlogs() {
    BlogList = BlogInfo.BlogList;
    BlogList.sort(function(x, y) {
        if (x.Time > y.Time) return -1;
        else if (x.Time < y.Time) return 1;
        return 0;
    })
}

function ShowBlogList(page = 0) {
    if (OnShowElement != null && OnShowElement != document.getElementById("BlogLinkList")) 
        OnShowElement.style.display = "none";
    OnShowElement = document.getElementById("BlogLinkList");
    OnShowElement.style.display = "";
    BlogLinkListElement.innerHTML = "";
    for (var i = page * 10; i < BlogList.length && i < (page + 1) * 10; i++) {
        var html_ele = BuildBlogTitleHtml(BlogList[i], i, page);
        BlogLinkElement.push(html_ele);
        BlogLinkListElement.innerHTML += html_ele;
        BlogLinkListElement.innerHTML += "<br/>";
    }
    NowPage = page
    document.getElementById("NowPage").innerText = NowPage;
}

function LastPage() {
    if (NowPage > 0) ShowBlogList(NowPage - 1);
}
function NextPage() {
    if ((NowPage + 1) * 10 < BlogList.length) ShowBlogList(NowPage + 1);
}

var From;

function BlogBack() {
    var info = From.split("$");
    if (info[0] == "list") ShowBlogList(Number(info[1]));
}

function ShowBlog(id, from) {
    if (OnShowElement != null && OnShowElement != document.getElementById("BlogDisplay")) 
        OnShowElement.style.display = "none";
    OnShowElement = document.getElementById("BlogDisplay");
    OnShowElement.style.display = "";
    From = from;
    BuildBlogContentHtml(document.getElementById("BlogDisplayContent"), BlogList[id].Path);
}

function Init() {
    while (document.readyState != "complete") ;
    BlogLinkListElement = document.getElementById("BlogLinkListContent");
    ChangeBackground();
    LoadBlogs();
    ShowBlogList();
}