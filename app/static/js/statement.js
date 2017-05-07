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
		autoclose:true
	}).on("click",function(){
		$("#datetimeStart").datetimepicker("setEndDate",$("#datetimeEnd").val());
	});
	//自定义范围营业额统计，设置结束日期
	$("#datetimeEnd").datetimepicker({
		format: 'yyyy-mm-dd',
		minView:'month',
		language: 'zh-CN',
		autoclose:true
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
	$("#calc_by_month").datetimepicker({
		format: 'yyyy-mm',
		minView:'year',
		maxView:'decade',
		language: 'zh-CN',
		startView: 'year',
		autoclose:true,
	}).on("click",function(){
		$("#calc_by_month").datetimepicker("setMonth",$("#calc_by_month".val()));
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
	$("#calc_by_year").datetimepicker({
		format: 'yyyy',  
        weekStart: 1,  
        autoclose: true,
        startView: 4,  
        minView: 4,  
        forceParse: false,  
        language: 'zh-CN'
	}).on("click",function(){
		$("#calc_by_year").datetimepicker("setYear",$("#calc_by_year".val()));
	});
});
//按日期统计营业额
function calc_by_day(){
	var date = $("#calc_by_day").val();
	if (date == "") {
		$("#myModal").modal("show");
		setTimeout(function(){$("#myModal").modal("hide")},800);
	} else {
		data = {
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
//按月份统计营业额
function calc_by_month(){
	var month = $("#calc_by_month").val();
	if (month == "") {
		$("#myModal").modal("show");
		setTimeout(function(){$("#myModal").modal("hide")},800);
	} else {
		data = {
			"month": month
		}
		$.ajax({
			async : false,
			type: "GET",
			url: "/calc_by_month",
			data: data,
			success: function(data){
				$("#month_turnover").html(data);
			}
		});
	}
}
//按年份统计营业额
function calc_by_year(){
	var year = $("#calc_by_year").val();
	if (year == "") {
		$("#myModal").modal("show");
		setTimeout(function(){$("#myModal").modal("hide")},800);
	} else {
		data = {
			"year": year
		}
		$.ajax({
			async : false,
			type: "GET",
			url: "/calc_by_year",
			data: data,
			success: function(data){
				$("#year_turnover").html(data);
			}
		});
	}
}
//按季度统计营业额
function calc_by_season(){
	var year = $("#calc_by_season").val();
	var season = $("#season").val();
	if (year == "") {
		$("#myModal").modal("show");
		setTimeout(function(){$("#myModal").modal("hide")},800);
	} else {
		data = {
			"season": season,
			"year": year
		}
		$.ajax({
			async : false,
			type: "GET",
			url: "/calc_by_season",
			data: data,
			success: function(data){
				$("#season_turnover").html(data);
			}
		});
	}
}
//按自定义时间范围统计营业额
function calc_by_custom(){
	var datetimeStart = $("#datetimeStart").val();
	var datetimeEnd = $("#datetimeEnd").val();
	if (datetimeStart == "" || datetimeEnd == "") {
		$("#myModal").modal("show");
		setTimeout(function(){$("#myModal").modal("hide")},800);
	} else {
		data = {
			"start_date": datetimeStart,
			"end_date": datetimeEnd
		}
		$.ajax({
			async : false,
			type: "GET",
			url: "/calc_by_custom",
			data: data,
			success: function(data){
				$("#custom_turnover").html(data);
			}
		});
	}
}