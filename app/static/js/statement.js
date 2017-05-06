//激活左侧导航栏
$(function(){
	$("li").click(function(){
		$("li").removeClass("active");
		$(this).addClass("active");
	});
});
//时间控件初始化
$(function(){
	//自定义范围营业额统计，设置开始日期
	$("#datetimeStart").datetimepicker({
		format: 'yyyy-mm-dd',
		minView:'month',
		language: 'zh-CN',
		autoclose:true,
		startDate:new Date()
	}).on("click",function(){
		$("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val());
	});
	//自定义范围营业额统计，设置结束日期
	$("#datetimeEnd").datetimepicker({
		format: 'yyyy-mm-dd',
		minView:'month',
		language: 'zh-CN',
		autoclose:true,
		startDate:new Date()
	}).on("click",function(){
		$("#datetimeEnd").datetimepicker("setStartDate",$("#datetimeStart".val()));
	});
	//日营业额统计，设置日期
	$("#calc_by_day").datetimepicker({
		format: 'yyyy-mm-dd',
		minView:'month',
		language: 'zh-CN',
		autoclose:true
	}).on("click",function(){
		$("#calc_by_day").datetimepicker("calc_by_day",$("#calc_by_day".val()));
	});
	//月营业额统计，只设置月份
	$("#datetimeMonth").datetimepicker({
		format: 'yyyy-mm',
		minView:'year',
		maxView:'decade',
		language: 'zh-CN',
		startView: 'year',
		autoclose:true,
	}).on("click",function(){
		$("#datetimeMonth").datetimepicker("setMonth",$("#datetimeMonth".val()));
	});
	//季度营业额统计，只设置年份
	$("#calc_by_season").datetimepicker({
		format: 'yyyy',  
        weekStart: 1,  
        autoclose: true,
        startView: 4,  
        minView: 4,  
        forceParse: false,  
        language: 'zh-CN'
	}).on("click",function(){
		$("#calc_by_season").datetimepicker("setYear",$("#calc_by_season".val()));
	});
	//年度营业额统计，只设置年份
	$("#datetimeYear").datetimepicker({
		format: 'yyyy',  
        weekStart: 1,  
        autoclose: true,
        startView: 4,  
        minView: 4,  
        forceParse: false,  
        language: 'zh-CN'
	}).on("click",function(){
		$("#datetimeYear").datetimepicker("setYear",$("#datetimeYear".val()));
	});
});
function calc_by_day(){
	var date = $("#calc_by_day").val();
	if (date == "") {
		$("#myModal").modal("show");
		setTimeout(function(){$("#myModal").modal("hide")},800);
	} else {
		data = {
			"calc_by":"day",
			"date": date
		}
		$.ajax({
			async : false,
			type: "GET",
			url: "/calc_by_day",
			data: data,
			success: function(data){
				$("#day_turnover").html(data);
			}
		});
	}
}