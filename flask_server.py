from flask import Flask
from utils import *
from gevent.pywsgi import WSGIServer
from flask import Response
from flask import request
from flask import jsonify
from pymongo import MongoClient
import json

app = Flask(__name__)
host = "202.121.178.254"
hostL = "0.0.0.0"
port = 83
mongoClient = MongoClient("202.121.179.53")
logTable = mongoClient["logMessage"]["message"]
# at most $limit records matched are returned
limit = 10
@app.route("/getByTime", methods=['GET'])
def getByTime():
    start = request.args.get("start")
    end = request.args.get("end")
    page = request.args.get("page") or 1
    skip = limit * (int(page.encode("utf-8")) - 1)
    if(start == None or end == None or start == "" or end == ""):
        return Response(status=400)
    else:
        results = logTable.find({"timestamp": {"$gte": int(start), "$lte": int(end)}}).limit(limit).skip(skip)
        serializeRes = json.dumps(list(results), separators=(',',':'), sort_keys=True, default=str)
        return jsonify(result=serializeRes)

@app.route("/getByAddr", methods=['GET'])
def getByFromAddr():
    fromAddr = request.args.get("fromAddr")
    toAddr = request.args.get("toAddr")
    start = request.args.get("start")
    end = request.args.get("end")
    page = request.args.get("page") or 1
    skip = limit * (int(page.encode("utf-8")) - 1)
    results = None
    if((fromAddr == None or fromAddr == "") and (toAddr == None or toAddr == "")):
        return Response(status=400)
    elif(fromAddr != None and fromAddr != "" and toAddr != None and toAddr != ""):
        if(start != None and start != "" and end != None and end != ""):
            results = logTable.find({"fromAddr": {"$eq": fromAddr}, "toAddr": {"$eq": toAddr}, "timestamp": {"$gte": int(start), "$lte": int(end)}}).limit(limit).skip(skip)
        else:
            results = logTable.find({"fromAddr": {"$eq": fromAddr}, "toAddr": {"$eq": toAddr}}).limit(limit).skip(skip)
    elif(fromAddr != None and fromAddr != ""):
        if(start != None and start != "" and end != None and end != ""):
            results = logTable.find({"fromAddr": {"$eq": fromAddr}, "timestamp": {"$gte": int(start), "$lte": int(end)}}).limit(limit).skip(skip)
        else:
            results = logTable.find({"fromAddr": {"$eq": fromAddr}}).limit(limit)
    else:
        if(start != None and start != "" and end != None and end != ""):
            results = logTable.find({"toAddr": {"$eq": toAddr}, "timestamp": {"$gte": int(start), "$lte": int(end)}}).limit(limit).skip(skip)
        else:
            results = logTable.find({"toAddr": {"$eq": toAddr}}).limit(limit).skip(skip)
    serializeRes = json.dumps(list(results), separators=(',',':'), sort_keys=True, default=str)
    return jsonify(result=serializeRes)
@app.route("/getByIp", methods=['GET'])
def getByIp():
    ip = request.args.get("ip")
    results = None
    start = request.args.get("start")
    end = request.args.get("end")
    page = request.args.get("page") or 1
    skip = limit * (int(page.encode("utf-8")) - 1)
    if(ip == None or ip == ""):
        return Response(status=400)
    else:
        if(start != None and start != "" and end != None and end != ""):
            results = logTable.find({"ipAddr": {"$eq": ip}, "timestamp": {"$gte": int(start), "$lte": int(end)}}).limit(limit).skip(skip)
        else:
            results = logTable.find({"ipAddr": {"$eq": ip}}).limit(limit).skip(skip)
        serializeRes = json.dumps(list(results), separators=(',',':'), sort_keys=True, default=str)
        return jsonify(result=serializeRes)
if __name__ == "__main__":
  http_server = WSGIServer((hostL, port), app)
  http_server.serve_forever()
