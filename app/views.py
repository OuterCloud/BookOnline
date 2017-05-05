# -*- coding: utf-8 -*-
from flask import render_template,request,jsonify
from app import app
import requests,os,subprocess,time,webbrowser,platform
from bs4 import BeautifulSoup
import os,time,re

app_dir_path = os.path.dirname(__file__)

@app.errorhandler(404)
def page_not_found(e):
	return render_template("404.html"),404

@app.errorhandler(500)
def page_not_found(e):
	return render_template("500.html"),500

@app.route("/",methods=["GET","POST"])
@app.route("/index",methods=["GET","POST"])
def index():
	if request.method == "GET":
		test = '1'
		return render_template("/index.html",kkk=test)

@app.route("/book",methods=["GET"])
def book():
	if request.method == "GET":
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
		return render_template("/book.html",dishes=dishes)

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
		return render_template("/favor.html")