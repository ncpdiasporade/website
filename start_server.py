import http.server
import socketserver
from pathlib import Path
from urllib.parse import unquote

PORT = 3000
HOST = "127.0.0.1"
ROOT = Path(__file__).resolve().parent

PUBLIC_FILES = {
    "index.html", "styles.css", "apple-touch-icon.png", "favicon-48.png",
    "robots.txt", "site.webmanifest", "sitemap.xml",
    "data/announcements.json", "data/blog-posts.json", "data/facebook-video-archive.json",
    "data/july-36-special.json", "data/july-resources.json", "data/recent-updates.json",
    "data/sovereignty-archive.json",
}
PAGE_DIRS = {"blog", "de", "en", "history", "july", "july-uprising", "sovereignty"}
PUBLIC_EXTENSIONS = {
    **dict.fromkeys(PAGE_DIRS, {".html", ".css", ".js"}),
    "js": {".js"},
    "img": {".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"},
    "docs": {".pdf"},
    "documents": {".pdf"},
}


class PublicSiteHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        if not self.is_public_path():
            self.send_error(404)
            return None
        return super().send_head()

    def is_public_path(self):
        try:
            pathname = unquote(self.path.partition("?")[0], errors="strict")
            if not pathname.startswith("/") or pathname.startswith("//") or any(char in pathname for char in "\\#?\x00"):
                return False
            parts = pathname.strip("/").split("/") if pathname.strip("/") else []
            if any(not part or part.startswith(".") for part in parts):
                return False
            requested = ROOT.joinpath(*parts)
            candidate = requested
            if not parts or (parts[0] in PAGE_DIRS and requested.is_dir()):
                candidate = requested / "index.html"
            allowed = candidate.relative_to(ROOT).as_posix() in PUBLIC_FILES
            if parts:
                allowed = allowed or candidate.suffix.lower() in PUBLIC_EXTENSIONS.get(parts[0], ())
            return allowed and candidate.resolve(strict=True) == candidate and candidate.is_file()
        except (OSError, RuntimeError, ValueError):
            return False

    def list_directory(self, path):
        self.send_error(404)
        return None


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    try:
        with ReusableTCPServer((HOST, PORT), PublicSiteHandler) as httpd:
            print(f"Serving at http://localhost:{PORT}", flush=True)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
