# -*- coding: utf-8 -*-
from flask import render_template,request,jsonify
from app import app
import requests,os,subprocess,time,webbrowser,platform
from bs4 import BeautifulSoup
import os,time,re,operator

app_dir_path = os.path.dirname(__file__)

#获取菜品文件夹下所有的菜品
def get_dishes():
	dishes_dir_path = os.path.join(app_dir_path,"static","pictures","dishes")
	dishes = []
	for root_path,dir_names,file_names in os.walk(dishes_dir_path):  
		for file_name in file_names:
			dish={}
			dish["dish_name"] = file_name[0:len(file_name)-4]
			dish_root = os.path.basename(root_path)
			seq = ("pictures","dishes",dish_root,file_name)
			dish["dish_path"] = "/".join(seq)
			dish["dish_cate"] = dish_root
			dishes.append(dish)
	return dishes

@app.errorhandler(404)
def page_not_found(e):
	return render_template("404.html"),404

@app.errorhandler(500)
def page_not_found(e):
	return render_template("500.html"),500

#首页
@app.route("/",methods=["GET","POST"])
@app.route("/index",methods=["GET","POST"])
def index():
	if request.method == "GET":
		test = '1'
		return render_template("/index.html",kkk=test)

#点餐页面
@app.route("/book",methods=["GET"])
def book():
	if request.method == "GET":
		return render_template("/book.html",dishes=get_dishes())

#保存点餐订单到本地账单
@app.route("/save",methods=["POST"])
def save():
	if request.method == "POST":
		bill_info = request.form.get("bill_info")
		customer_info = request.form.get("customer_info")
		time_info = time.strftime('%Y-%m-%d %H:%M',time.localtime(time.time()))
		print(time_info)
		#当日账单文件地址
		file_name = time.strftime('%Y-%m-%d',time.localtime(time.time()))+"账单.txt"
		file_path = os.path.join(app_dir_path,"data",file_name)
		if os.path.exists(file_path):
			with open(file_path, 'a') as f:
				title = "顾客信息："+time_info+" "+customer_info+"\n"
				f.write(title)
				bill_info = re.sub("<input.*>","",bill_info)
				bill_info = re.sub("<br>","\n",bill_info)
				bill_info = "具体消费信息：\n"+bill_info+"\n"
				f.write(bill_info)
				f.write("——————————————————————————————\n")
		else:
			with open(file_path, 'w') as f:
				title = "顾客信息："+time_info+" "+customer_info+"\n"
				f.write(title)
				bill_info = re.sub("<input.*>","",bill_info)
				bill_info = re.sub("<br>","\n",bill_info)
				bill_info = "具体消费信息：\n"+bill_info+"\n"
				f.write(bill_info)
				f.write("——————————————————————————————\n")
		return "OK"

#修改账单页面
@app.route("/modify",methods=["GET","POST"])
def modify():
	if request.method == "GET":
		#当日账单文件地址
		file_name = time.strftime('%Y-%m-%d',time.localtime(time.time()))+"账单.txt"
		file_path = os.path.join(app_dir_path,"data",file_name)
		bills = []
		if os.path.exists(file_path):
			sig = "ok"
			with open(file_path) as f:
				content = f.read()
				bills = content.split("——————————————————————————————")
		else:
			sig = "null"
		return render_template("/modify.html",sig=sig,bills=bills)

#保存对账单的修改
@app.route("/save_modification",methods=["POST"])
def save_modification():
	if request.method == "POST":
		old_bill_info = request.form.get("old_bill_info")
		new_bill_info = request.form.get("new_bill_info")
		old_bill_info_norm = ""
		new_bill_info_norm = ""
		for line in old_bill_info.split("<br>"):
			old_bill_info_norm += line.strip()+"\n"
		for line in new_bill_info.split("<br>"):
			new_bill_info_norm += line.strip()+"\n"
		old_bill_info_norm = old_bill_info_norm.strip("\n")
		new_bill_info_norm = new_bill_info_norm.strip("\n")
		customer_info = re.search("顾客信息.*\n",old_bill_info_norm)
		if customer_info:
			customer_info = customer_info.group(0).strip()
		#当日账单文件地址
		file_name = time.strftime('%Y-%m-%d',time.localtime(time.time()))+"账单.txt"
		file_path = os.path.join(app_dir_path,"data",file_name)
		old_content = ""
		new_content = ""
		with open(file_path,"r") as f:
			old_content = f.read()
			#懒惰匹配要修改的段落内容
			new_content = re.sub(customer_info+"[\s\S]*?本账单共需支付：.*元",new_bill_info_norm,old_content)
			print(new_content)
		with open(file_path,"w") as f:
			f.write(new_content)
		return "ok"

@app.route("/favor",methods=["GET"])
def favor():
	if request.method == "GET":
		sort_by = request.args.get("sortBy")
		data_path = os.path.join(app_dir_path,"data")
		current_year_month = time.strftime('%Y-%m',time.localtime(time.time()))
		current_year = current_year_month.split("-")[0]
		current_month = current_year_month.split("-")[1]
		current_day = time.strftime('%Y-%m-%d',time.localtime(time.time()))
		dishes = []
		for dish in get_dishes():
			#增加销量键并赋初值为0
			dish["sales_volumn"] = 0
			dishes.append(dish)
		if sort_by == "all":
			desc = "累计销量 "
			for dish in dishes:
				for root_path,dir_names,file_names in os.walk(data_path):
					for file_name in file_names:
						file_path = os.path.join(root_path,file_name)
						#print(file_path)
						with open(file_path,"r") as f:
							f_content = f.read()
							dish_sales = re.findall(dish["dish_name"]+".*份",f_content)
							if dish_sales:
								for dish_sale_info in dish_sales:
									#print(dish_sale_info)
									volumn = re.search("[0-9]*份",dish_sale_info)
									if volumn:
										volumn = int(volumn.group(0).replace("份",""))
										dish["sales_volumn"] += volumn
				#print(dish["dish_name"]+":"+str(dish["sales_volumn"])+"份")
			all_sales_sorted = sorted(dishes, key=operator.itemgetter("sales_volumn"), reverse=True)
			return render_template("/favor.html",sales_sorted=all_sales_sorted,by_all="active",desc=desc)
		if sort_by == "day":
			desc = "本日 "+current_day+" "
			#当日账单文件地址
			file_name = time.strftime('%Y-%m-%d',time.localtime(time.time()))+"账单.txt"
			file_path = os.path.join(app_dir_path,"data",file_name)
			for dish in dishes:
				with open(file_path,"r") as f:
					f_content = f.read()
					dish_sales = re.findall(dish["dish_name"]+".*份",f_content)
					if dish_sales:
						for dish_sale_info in dish_sales:
							#print(dish_sale_info)
							volumn = re.search("[0-9]*份",dish_sale_info)
							if volumn:
								volumn = int(volumn.group(0).replace("份",""))
								dish["sales_volumn"] += volumn
			day_sales_sorted = sorted(dishes, key=operator.itemgetter("sales_volumn"), reverse=True)
			return render_template("/favor.html",sales_sorted=day_sales_sorted,by_day="active",desc=desc)
		if sort_by == "month":
			desc = "本月 "+current_year_month+" "
			for dish in dishes:
				for root_path,dir_names,file_names in os.walk(data_path):
					for file_name in file_names:
						if file_name.startswith(current_year_month):
							file_path = os.path.join(root_path,file_name)
							#print(file_path)
							with open(file_path,"r") as f:
								f_content = f.read()
								dish_sales = re.findall(dish["dish_name"]+".*份",f_content)
								if dish_sales:
									for dish_sale_info in dish_sales:
										#print(dish_sale_info)
										volumn = re.search("[0-9]*份",dish_sale_info)
										if volumn:
											volumn = int(volumn.group(0).replace("份",""))
											dish["sales_volumn"] += volumn
			month_sales_sorted = sorted(dishes, key=operator.itemgetter("sales_volumn"), reverse=True)
			return render_template("/favor.html",sales_sorted=month_sales_sorted,by_month="active",desc=desc)
		if sort_by == "season":
			current_year_spring = [current_year+"-03",current_year+"-04",current_year+"-05"]
			current_year_summer = [current_year+"-06",current_year+"-07",current_year+"-08"]
			current_year_autumn = [current_year+"-09",current_year+"-10",current_year+"-11"]
			current_year_winter = [current_year+"-12",current_year+"-01",current_year+"-02"]
			desc = ""
			if current_year_month in current_year_spring:
				desc = "本季 "+current_year+"春季 "
				current_season = current_year_spring
			if current_year_month in current_year_summer:
				desc = "本季 "+current_year+"夏季 "
				current_season = current_year_summer
			if current_year_month in current_year_autumn:
				desc = "本季 "+current_year+"秋季 "
				current_season = current_year_autumn
			if current_year_month in current_year_winter:
				desc = "本季 "+current_year+"冬季 "
				current_season = current_year_winter
			for dish in dishes:
				for root_path,dir_names,file_names in os.walk(data_path):
					for file_name in file_names:
						file_year_month = re.search("[0-9]*\-[0-9][0-9]",file_name).group(0)
						#print(file_year_month)
						file_path = os.path.join(root_path,file_name)
						if file_year_month in current_season:
							#print(file_path)
							with open(file_path,"r") as f:
								f_content = f.read()
								dish_sales = re.findall(dish["dish_name"]+".*份",f_content)
								if dish_sales:
									for dish_sale_info in dish_sales:
										#print(dish_sale_info)
										volumn = re.search("[0-9]*份",dish_sale_info)
										if volumn:
											volumn = int(volumn.group(0).replace("份",""))
											dish["sales_volumn"] += volumn
			season_sales_sorted = sorted(dishes, key=operator.itemgetter("sales_volumn"), reverse=True)
			return render_template("/favor.html",sales_sorted=season_sales_sorted,by_season="active",desc=desc)
		if sort_by == "year":
			desc = "本年 "+current_year+" "
			for dish in dishes:
				for root_path,dir_names,file_names in os.walk(data_path):
					for file_name in file_names:
						file_year = re.search("[0-9]*\-",file_name).group(0).strip("-")
						if file_year == current_year:
							file_path = os.path.join(root_path,file_name)
							#print(file_path)
							with open(file_path,"r") as f:
								f_content = f.read()
								dish_sales = re.findall(dish["dish_name"]+".*份",f_content)
								if dish_sales:
									for dish_sale_info in dish_sales:
										#print(dish_sale_info)
										volumn = re.search("[0-9]*份",dish_sale_info)
										if volumn:
											volumn = int(volumn.group(0).replace("份",""))
											dish["sales_volumn"] += volumn
			year_sales_sorted = sorted(dishes, key=operator.itemgetter("sales_volumn"), reverse=True)
			return render_template("/favor.html",sales_sorted=year_sales_sorted,by_year="active",desc=desc)

@app.route("/calc",methods=["GET"])
def calc():
	if request.method == "GET":
		calc_by = request.args.get("by")
		return render_template("/statement.html")