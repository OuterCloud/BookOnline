//动态为页面新增的元素绑定click事件
$(function(){
	//修改账单
	$("tbody").on("click",".btn-danger",function(){
		var old_bill_info = $(this).parent().parent().find("div").html();
		$("#modify_share").html(old_bill_info);
		$(this).parent().parent().find("div").attr("contentEditable",true);
		//自动聚焦
		$(this).parent().parent().find("div").focus();
		$(this).parent().html("<button class=\"btn btn-warning\">保存</button>");
		//将其他修改按钮设置为disabled状态
		$('.btn-danger').attr('disabled',"true");
	});
	//加餐
	$("tbody").on("click",".btn-primary",function(){
		var old_bill_info = $(this).parent().parent().find("div").html();
		$("#modify_share").html(old_bill_info);
		//弹出加餐模态框
		$("#addBillModal").modal("show");
	});
	//保存加餐
	$('#save_add_bill').click(function (){
		//从前端获取顾客信息（餐头）
		var re_customer = new RegExp("^[\\s\\S]*顾客信息：[\\s\\S]*$","");
		var old_bill_info = $("#modify_share").html();
		var lines = old_bill_info.split("<br>");
		var customer_info = ""
		for (var i = 0; i < lines.length; i++) {
			if (re_customer.test($.trim(lines[i])) == true) {
				customer_info = lines[i];
			}
		}
		//把加餐信息与old_bill_info合并并传到后台
		var add_dishes_info = new Array();
		add_dishes_info.push(customer_info)
		$(".amount").each(function(){
    		if ($(this).val() != "0") {
    			var add_dish_info = {}
    			var add_volumn = $(this).val();
    			var add_dish_name = $(this).prev("div").html();
    			add_dish_info = add_dish_name+"&&&"+add_volumn;
    			add_dishes_info.push(add_dish_info);
    		}
  		});
  		//将加餐信息传到后台
  		data = {
  			"add_dishes_info":add_dishes_info,
  		}
  		$.ajax({
			async : false,
			type: "POST",
			url: "/save_add_dishes",
			data: data,
			success: function(data){
				if (data == "ok") {
					setTimeout(function(){$("#addBillModal").modal("hide")},100);
			        //还原按钮状态
					$('.btn-danger').removeAttr("disabled");
					$('.btn-primary').removeAttr("disabled");
					//初始化加餐单（刷新页面）
					window.location.reload();
				}
			}
		});
    });
	//保存账单修改
	$("tbody").on("click",".btn-warning",function(){
		//获取账单内容的操作必须在页面动态新增元素之前，否则$(this)失效
		var old_bill_info = $("#modify_share").html()
		//自动重新计算生成新账单
		var new_bill_info = $(this).parent().parent().find("div").html();
		//alert(new_bill_info);
		var lines = new_bill_info.split("<br>");
		var re_1 = new RegExp("^[\\s\\S]*单价：[0-9]*元[\\s\\S]*份数：[0-9]*份[\\s\\S]*共：[0-9]*元$","");
		var re_2 = new RegExp("^[\\s\\S]*顾客信息：[\\s\\S]*$","");
		var re_3 = new RegExp("^[\\s\\S]*具体消费信息：[\\s\\S]*$","");
		var new_total_price = 0;
		var new_lines = new Array();
		for (i=0; i<lines.length ;i++ ) 
		{
			if(re_1.test(lines[i]) == true){
				//菜名
				var dish_name_reg = new RegExp("[\\s\\S]*单价：","");
				var dish_name_part = dish_name_reg.exec(lines[i])[0];
				var dish_name = dish_name_part.substring(0,dish_name_part.length-4);
				//单价
				var solo_price_part_reg = new RegExp("单价：[0-9]*元", "");
				var solo_price_part = solo_price_part_reg.exec(lines[i])[0];
				var solo_price_reg = new RegExp("[0-9]*元", "");
				var solo_price = solo_price_reg.exec(solo_price_part)[0];
				solo_price = solo_price.substring(0,solo_price.length-1);
				solo_price = parseInt(solo_price);
				//份数
				var volumn_part_reg = new RegExp("份数：[0-9]*份", "");
				var volumn_part = volumn_part_reg.exec(lines[i])[0];
				var volumn = volumn_part.substring(3,volumn_part.length-1);
				volumn = parseInt(volumn);
				//单项结算
				var new_price = solo_price*volumn;
				new_total_price += new_price;
				var new_line = dish_name+" 单价："+solo_price.toString()+"元 份数："+volumn.toString()+"份 共："+new_price.toString()+"元";
				new_lines.push(new_line);
			}
			if(re_2.test(lines[i]) == true){
				new_lines.push(lines[i]);
			}
			if(re_3.test(lines[i]) == true){
				new_lines.push(lines[i]);
			}
		}
		var final_line = "<br>本账单共需支付："+new_total_price.toString()+"元";
		new_lines.push(final_line);
		var final_new_bill_info = new_lines.join("<br>");
		$(this).parent().parent().find("div").attr("contentEditable",false);
		$(this).parent().html("<button class=\"btn btn-danger\">修改</button>");
		data = {
			"old_bill_info":old_bill_info,
			"new_bill_info":final_new_bill_info
		}
		$.ajax({
			async : false,
			type: "POST",
			url: "/save_modification",
			data: data,
			success: function(data){
				if (data == "ok") {
					$("#myModal").modal("show");
					setTimeout(function(){$("#myModal").modal("hide")},800);
					//解除其他修改按钮的disabled状态
					$('.btn-danger').removeAttr("disabled");
					window.location.reload();
				}
			}
		});
	});
});
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