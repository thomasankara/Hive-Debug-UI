import logging
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import redis
import threading
import time
from flask_cors import CORS
from gevent import monkey
from gevent.pywsgi import WSGIServer

monkey.patch_all()

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='gevent')

# Configurer Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

@app.route('/start_activity', methods=['POST'])
def start_activity():
    data = request.get_json()
    timestamp = data.get('timestamp', '0')
    id_sender = data.get('id_sender', '0')
    info = data.get('info')
    message = f"{timestamp}|{id_sender}|{info}"
    r.publish('INT_START_ACTIVITY', message)
    return jsonify({"status": "success", "message": message})

@app.route('/pause_activity', methods=['POST'])
def pause_activity():
    data = request.get_json()
    timestamp = data.get('timestamp', '0')
    id_sender = data.get('id_sender', '0')
    info = data.get('info')
    message = f"{timestamp}|{id_sender}|{info}"
    r.publish('INT_PAUSE_ACTIVITY', message)
    return jsonify({"status": "success", "message": message})

@app.route('/unpause_activity', methods=['POST'])
def unpause_activity():
    data = request.get_json()
    timestamp = data.get('timestamp', '0')
    id_sender = data.get('id_sender', '0')
    info = data.get('info')
    message = f"{timestamp}|{id_sender}|{info}"
    r.publish('INT_UNPAUSE_ACTIVITY', message)
    return jsonify({"status": "success", "message": message})

@app.route('/abort_activity', methods=['POST'])
def abort_activity():
    data = request.get_json()
    timestamp = data.get('timestamp', '0')
    id_sender = data.get('id_sender', '0')
    info = data.get('info')
    message = f"{timestamp}|{id_sender}|{info}"
    r.publish('INT_ABORD_ACTIVITY', message)
    return jsonify({"status": "success", "message": message})

@app.route('/add_coworker', methods=['POST'])
def add_coworker():
    data = request.get_json()
    timestamp = data.get('timestamp', '0')
    id_sender = data.get('id_sender', '0')
    new_coworker_id = data.get('new_coworker_id')
    message = f"{timestamp}|{id_sender}|{new_coworker_id}"
    r.publish('INT_ADD_COWORKER', message)
    return jsonify({"status": "success", "message": message})

@app.route('/pause_plus_activity', methods=['POST'])
def pause_plus_activity():
    data = request.get_json()
    timestamp = data.get('timestamp', '0')
    id_sender = data.get('id_sender', '0')
    info_type = data.get('info_type')
    info1 = data.get('info1', '0')
    info2 = data.get('info2', '0')
    message = f"{timestamp}|{id_sender}|{info_type}|{info1}|{info2}"
    r.publish('INT_PAUSE_PLUS_ACTIVITY', message)
    return jsonify({"status": "success", "message": message})

@app.route('/get_activity_list', methods=['POST'])
def get_activity_list():
    data = request.get_json()
    timestamp = data.get('timestamp')
    r.publish('DBG_GET_ACTIVITY_LIST', timestamp)
    return jsonify({"status": "success", "timestamp": timestamp})

@app.route('/get_event_list', methods=['POST'])
def get_event_list():
    data = request.get_json()
    timestamp = data.get('timestamp')
    r.publish('DBG_GET_EVENT_LIST', timestamp)
    return jsonify({"status": "success", "timestamp": timestamp})

@app.route('/get_coworker_list', methods=['POST'])
def get_coworker_list():
    data = request.get_json()
    timestamp = data.get('timestamp')
    r.publish('DBG_GET_COWORKER_LIST', timestamp)
    return jsonify({"status": "success", "timestamp": timestamp})

@app.route('/add_activity', methods=['POST'])
def add_activity():
    data = request.get_json()
    timestamp = data.get('timestamp', '0')
    id_sender = data.get('id_sender', '0')
    info_type = data.get('info_type', 'da')
    activityType = data.get('activityType', '')
    activityInfo = data.get('activityInfo', '')
    info1 = data.get('info1', '0')
    info2 = data.get('info2', '0')
    message = f"{timestamp}|{id_sender}|{activityType}|{activityInfo}|{info1}|{info2}|{info_type}"
    r.publish('INT_ADD_ACTIVITY', message)
    return jsonify({"status": "success", "message": message})

def redis_listener():
    pubsub = r.pubsub()
    pubsub.subscribe('OUT_COWORKER_HFM')
    logging.debug("Subscribed to OUT_COWORKER_HFM channel")
    for message in pubsub.listen():
        logging.debug(f"Message received from Redis: {message}")
        if message['type'] == 'message':
            logging.debug(f"Processing message: {message['data']}")
            timestamp = time.strftime('%H:%M:%S', time.localtime())
            data = {'message': message['data'], 'timestamp': timestamp}
            socketio.emit('new_message', data)
            logging.debug(f"Emitted message: {data}")

if __name__ == '__main__':
    thread = threading.Thread(target=redis_listener)
    thread.daemon = True
    thread.start()
    # Utiliser WSGIServer pour exécuter l'application
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    socketio.run(app, debug=True)
