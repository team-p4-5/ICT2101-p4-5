import warnings
from gevent import monkey

monkey.patch_all()
from gevent.pywsgi import WSGIServer
from app import app

HOST, PORT = '0.0.0.0', 80

try:
    warnings.filterwarnings('ignore')
    print(f"[*] Starting Web UI on addr: {HOST}:{PORT}")

    http_server = WSGIServer((HOST, PORT), app)
    http_server.serve_forever()

except KeyboardInterrupt:
    pass
except Exception as e:
    print(f"[ERR]: {e}")
