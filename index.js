let BackgroundList = ["1.webp", "2.webp"];
var BlogList = null;
let LastId = -1;
function ChangeBackground() {
    var id = LastId;
    while (id == LastId)
        id = Math.floor(Math.random() * BackgroundList.length);
    LastId = id;
    document.body.background = "./Backgrounds/" + BackgroundList[id];
}
function LoadBlogs() {
    var blog_json = document.createElement("script");
    blog_json.src = "./Dataset/Blogs/bloglist.json";
    blog_json.type = "text/javascript";
    document.head.appendChild(blog_json);
    BlogList = BlogInfo.BlogList;
}

function ShowBlogList() {
    for (var i = 0; i < BlogList.length; i++)
        console.log(BlogList[i]);
}

function Init() {
    ChangeBackground();
    LoadBlogs();
    ShowBlogList();
}