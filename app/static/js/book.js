//显示缩略图
function ResizeImage(ThisPic,RePicWidth){
	var TrueWidth = ThisPic.width;    //图片实际宽度
    var TrueHeight = ThisPic.height;  //图片实际高度
    var Multiple = TrueWidth / RePicWidth;  //图片缩小(放大)的倍数
    ThisPic.width = RePicWidth;  //图片显示的可视宽度
    ThisPic.height = TrueHeight / Multiple;  //图片显示的可视高度
}
//加减订单
$(function (){
    $('.glyphicon-plus-sign').click(function (){
        var input_parent = $(this).parent().parent().parent();
        var curr_amount = input_parent.find('input').attr("value");
        input_parent.find('input').attr("value",parseInt(curr_amount)+1);
    });
    $('.glyphicon-minus-sign').click(function (){
        var input_parent = $(this).parent().parent().parent();
        var curr_amount = input_parent.find('input').attr("value");
        if (parseInt(curr_amount) > 0) {
        	input_parent.find('input').attr("value",parseInt(curr_amount)-1);
        }
    });
})
//激活左侧导航栏
$(function(){
	$("li").click(function(){
		$("li").removeClass("active");
		$(this).addClass("active");
	});
});
//显示账单
function book(){
	var book_str = "";
	var dish_info = "";
	var price = 0;
	$('.amount').each(function(){
		if ($(this).attr("value") != "0") {
			var dish_dic = {};
			var dish_amount = parseInt($(this).attr("value"));
			var dish_name = $(this).parent().parent().find('p').html().split(" ")[0];
			var dish_price = $(this).parent().parent().find('p').html().split(" ")[1];
			book_str = book_str+dish_name+"&"+dish_price+"&"+dish_amount+"&&";
			dish_info = dish_info+dish_name+" "+dish_price+" "+dish_amount+"份 "+"共："+parseInt(dish_price)*parseInt(dish_amount)+"元<br>";
			price = price+parseInt(dish_price)*parseInt(dish_amount);
		}
	});
	if (book_str == "") {
		document.getElementById("modalFooter").innerHTML = "<button type='button' onclick='refresh()' class='btn btn-default' data-dismiss='modal'>关闭</button>";
		document.getElementById("modalBody").innerHTML = "您还没点餐";
	}else{
		document.getElementById("modalFooter").innerHTML = "<button type=\"button\" onclick=\"save_bill()\" class=\"btn btn-default\">保存账单</button>";
		dish_info = dish_info+"<br>"+"本账单共需支付："+price+"元<br><br>";
		dish_info += "<input type=\"text\" id=\"customer_info\" class=\"form-control\" placeholder=\"请输入顾客信息（例如：位置、姓名、电话等）\">"
		document.getElementById("modalBody").innerHTML = dish_info;
	}
}
//保存账单
function save_bill(){
	var bill_info = document.getElementById("modalBody").innerHTML;
	var customer_info = $("#customer_info").val();
	var data = {
		"bill_info":bill_info,
		"customer_info":customer_info
	};	
	$.ajax({
		async : false,
		type: "POST",
		url: "/save",
		data: data,
		success: function(data){
			if (data == "OK") {
				document.getElementById("myModalLabel").innerHTML = "账单已保存";
				document.getElementById("modalFooter").innerHTML = "<button type='button' onclick='refresh()' class='btn btn-default' data-dismiss='modal'>关闭</button>";
			}
		}
	});
}
//刷新页面
function refresh(){
	window.location.reload();
}