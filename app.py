from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"answer": "Please ask me something."})

    answer = (
        "Hello! I am Power AI. "
        "Your message is: " + message +
        ". My AI brain is being configured."
    )

    return jsonify({"answer": answer})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
