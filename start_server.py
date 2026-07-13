import http.server
import socketserver

PORT = 3000
HOST = "127.0.0.1"
Handler = http.server.SimpleHTTPRequestHandler


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


try:
    with ReusableTCPServer((HOST, PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}", flush=True)
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
