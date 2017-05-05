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
	//保存账单修改
	$("tbody").on("click",".btn-warning",function(){
		//获取账单内容的操作必须在页面动态新增元素之前，否则$(this)失效
		var old_bill_info = $("#modify_share").html()
		var new_bill_info = $(this).parent().parent().find("div").html();
		$(this).parent().parent().find("div").attr("contentEditable",false);
		$(this).parent().html("<button class=\"btn btn-danger\">修改</button>");
		data = {
			"old_bill_info":old_bill_info,
			"new_bill_info":new_bill_info
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