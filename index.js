let BackgroundList = ["1.webp", "2.webp"];
BlogList = null;
let LastId = -1;
function ChangeBackground() {
    var id = LastId;
    while (id == LastId)
        id = Math.floor(Math.random() * BackgroundList.length);
    LastId = id;
    document.body.background = "./Backgrounds/" + BackgroundList[id];
}
function LoadBlogs() {
    fetch("./Dataset/Blogs/bloglist.json")
        .then((response) => { return response.json(); } )
        .then((data) => BlogList = data);
    console.log(BlogList);
}

function ShowBlogList() {
    for (var i = 0; i < BlogNameList.length; i++)
        document.body += BlogNameList;
}

function Init() {
    ChangeBackground();
    LoadBlogs();
}