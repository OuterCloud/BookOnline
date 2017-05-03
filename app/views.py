# -*- coding: utf-8 -*-
from flask import render_template,request,jsonify
from app import app
import requests,os,subprocess,time,webbrowser,platform
from bs4 import BeautifulSoup
import os

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
		app_dir_path = os.path.dirname(__file__)
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

@app.route("/calc",methods=["POST"])
def calc():
	if request.method == "POST":
		book_str = request.form.get("book_str")
		return book_str

@app.route("/favor",methods=["GET"])
def favor():
	if request.method == "GET":
		return render_template("/favor.html")