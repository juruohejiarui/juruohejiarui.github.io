let BackgroundList = ["1.webp", "2.webp"];
BlogNameList = null;
let LastId = -1;
function ChangeBackground() {
    var id = LastId;
    while (id == LastId)
        id = Math.floor(Math.random() * BackgroundList.length);
    LastId = id;
    document.body.background = "./Backgrounds/" + BackgroundList[id];
}
function LoadBlogs() {
    $.ajax({
        url: "./Dataset/Blogs", //目标目录路径
        success: function (data) {
        $(data).find("a:contains(.html)").each(function () {
                let tmp = $(this).attr("href");
                let idx = tmp.lastIndexOf('/');
                tmp = tmp.slice(idx + 1, tmp.length);
                BlogNameList.push(tmp);
            });
            var reg = /.*(?=\.html)/;
            
            BlogNameList.sort((x, y) => { //对文件名进行排序
                x = x.match(reg)[0];
                y = y.match(reg)[0];
                return parseInt(x) - parseInt(y);
            });
        }
    });
}

function ShowBlogList() {
    for (var i = 0; i < BlogNameList.length; i++)
        document.body += BlogNameList;
}

function Init() {
    ChangeBackground();
    LoadBlogs();
}