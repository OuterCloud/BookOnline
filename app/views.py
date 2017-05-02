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
		print(os.path)
		return render_template("/book.html")

@app.route("/favor",methods=["GET"])
def favor():
	if request.method == "GET":
		return render_template("/favor.html")