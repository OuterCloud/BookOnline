//显示缩略图
function ResizeImage(ThisPic,RePicWidth){
	var TrueWidth = ThisPic.width;    //图片实际宽度
    var TrueHeight = ThisPic.height;  //图片实际高度
    var Multiple = TrueWidth / RePicWidth;  //图片缩小(放大)的倍数
    ThisPic.width = RePicWidth;  //图片显示的可视宽度
    ThisPic.height = TrueHeight / Multiple;  //图片显示的可视高度
}
$(function (){
    $('ul li').click(function (){
        //把之前已有的active去掉
        $('.active').removeClass('active');
        //当前点击的li加上class
        $(this).addClass("active");
    });
})