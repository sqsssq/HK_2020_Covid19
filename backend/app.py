'''
Description: 
Author: Qing Shi
Date: 2022-11-20 19:14:42
LastEditTime: 2022-11-26 03:59:50
'''
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import pandas as pd
import os

FILE_ABS_PATH = os.path.dirname(__file__)

app = Flask(__name__)
CORS(app)
# session.permanent=True

@app.route('/api/test/hello/', methods=['POST'])
def hello_resp():
    params = request.json
    # msg = int(params['msg'])
    # print(msg)
    return "hello VUE"

@app.route('/api/test/fetchAllData/', methods=['POST'])
def fetchAllData():
    params = request.json
    data_path = '{}/data/covidData1.json'.format(FILE_ABS_PATH)
    with open(data_path, 'rt', encoding="gbk") as input_file:
        data = json.load(input_file)
        return data