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
	dish_info = dish_info+"<br>"+"本账单共需支付："+price+"元"
	if (book_str == "") {
		document.getElementById("modalBody").innerHTML = "您还没点餐";
		$('#myModal').modal('show');
	}else{
		document.getElementById("modalBody").innerHTML = dish_info;
		$('#myModal').modal('show');
		var data = {"book_str":book_str};
		var price = 0;
		$.ajax({
			async : false,
			type: "POST",
			url: "/calc",
			data: data,
			success: function(data){
				
			}
		});
	}
}