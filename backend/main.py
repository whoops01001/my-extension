from pymongo import MongoClient
from config import MONGO_CONECTION
import json
from flask import Flask, request, Response
# from flask_cors import CORS
from flask import jsonify
from urllib.parse import urlparse

app = Flask(__name__)
# CORS(app)

client = MongoClient(MONGO_CONECTION)
db = client.Detecting_Malicious_URL_db
collection = db.formated_url
collection_reported = db.user_report_url
collection_excluded = db.user_exclude_url


@app.route('/api/check', methods=['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
def check_request_url():
    if request.method == 'GET':  # waiting
        return "GET"
    elif request.method == 'POST':
        url = request.form["url"]
        print(url)
        o = urlparse(url)
        if o.scheme != '':
            url = url[len(o.scheme) + 3:]
        if url[-1] == "/":
            url = url[0:-1]

        result = collection.find_one({"url": url})
        print(url)
        print(result)
        if result == None:
            response_data = {
                "result": {
                    "label": "-1",
                    "scource": "databse"
                }
            }
            return jsonify(response_data)
        else:
            response_data = {
                "result": {
                    "label": result["label"],
                    "scource": "databse"
                }
            }
            return jsonify(response_data)

    elif request.method == 'PATCH':  # waiting
        return "PATCH"

    elif request.method == 'PUT':  # waiting
        return "PUT"

    elif request.method == 'DELETE':  # waiting
        return "ECHO: DELETE"


# for exclude url to black or white list
@app.route('/api/exclude/url', methods=['POST'])
def request_exclude_url():
    if request.method == 'POST':
        data = []
        userId = request.form["user_id"]
        url = request.form["url_exclude"]
        label = request.form["label"]

        o = urlparse(url)
        if o.scheme != '':
            url = url[len(o.scheme) + 3:]
        if url[-1] == "/":
            url = url[0:-1]

        data.append({
            "user_id": userId,
            "url": url.strip(),
            "label": label.strip()
        })

        collection_excluded.insert_many(data)

        response_data = {
            "result": {
                "status": "Done !",
            }
        }

        return jsonify(response_data)


# for add url to black or white list
@app.route('/api/report/url', methods=['POST'])
def request_report_url():
    if request.method == 'POST':
        userId = request.form["user_id"]
        url = request.form["url_report"]
        label = request.form["label"]
        content_report = request.form["content_report"]
        data = []

        o = urlparse(url)
        if o.scheme != '':
            url = url[len(o.scheme) + 3:]
        if url[-1] == "/":
            url = url[0:-1]

        data.append({
            "user_Id": userId,
            "url": url,
            "label": label,
            "reason": content_report
        })

        collection_reported.insert_many(data)
        response_data = {
            "result": {
                "status": "Report success, thanks your reported !",
            }
        }

        return jsonify(response_data)


if __name__ == '__main__':
    app.run()
