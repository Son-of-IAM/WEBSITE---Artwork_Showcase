import http.server
import socketserver
import webbrowser
import os

# ==========================================
# LOCAL SERVER CONFIGURATION
# ==========================================
PORT = 8000
# Points directly to your website root
DIRECTORY = r"C:\Users\ayole\OneDrive\Desktop\PROJECTS\Precious"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Forces the server to look in your specific Precious folder
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    # Suppress normal log messages to keep the terminal clean
    def log_message(self, format, *args):
        pass

def start_server():
    # Allow the port to be reused immediately if you restart the script
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Live Server running!")
        print(f"🌐 Viewing at: http://localhost:{PORT}")
        print("Press Ctrl+C in this terminal to stop the server.")
        
        # Automatically open your default web browser to the site
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped gracefully.")

if __name__ == "__main__":
    # Ensure the directory exists before starting
    if not os.path.exists(DIRECTORY):
        print(f"Error: Could not find the directory {DIRECTORY}")
    else:
        start_server()