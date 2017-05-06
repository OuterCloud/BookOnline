//激活左侧导航栏
$(function(){
	$("li").click(function(){
		$("li").removeClass("active");
		$(this).addClass("active");
	});
});