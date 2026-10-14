import json, os, re, time
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 604800  # static files cache 7 days
BASE = os.path.dirname(os.path.abspath(__file__))
MSG_FILE = os.path.join(BASE, "messages.jsonl")

# ====== EDHU VENUMNALUM INGA MAATHIKALAM ======
PROFILE = {
    "name": "Sheelfer. A",
    "role": "BCA Graduate | Python Developer (Fresher)",
    "about": "I am a BCA graduate from Pondicherry University Community College (2021-2024) "
             "who enjoys solving problems with Python. I am looking for a fresher role where "
             "I can learn quickly, write clean code and grow with a team.",
    "email": "sheelfera@gmail.com",
    "linkedin": "https://www.linkedin.com/in/sheelfer-a",   # unga exact LinkedIn link inga podunga
    "github": "https://github.com/sheelfer-a",
}
EDUCATION = [
    ("Bachelor of Computer Applications (BCA)", "Pondicherry University Community College", "2021 - 2024"),
    ("Higher Secondary Education (HSC)", "Navalar Nedunchezhiyan Higher Secondary School", "2020 - 2021"),
    ("Secondary School Education (SSLC)", "Perunthalaivar Kamaraj Higher Secondary School", "2018 - 2019"),
]
SKILLS = {
    "Technical": ["Python", "HTML5", "CSS3", "MySQL (Basic)", "XML"],
    "Soft Skills": ["Problem-solving", "Patience", "Flexibility"],
    "Languages": ["English", "Tamil"],
}
# Sample projects - unga real projects vandhadhum idhai maathunga
PROJECTS = [
    {"title": "Sample Project 1", "desc": "Replace this with your Python mini project, for example a calculator or to-do app.",
     "tags": ["Python"], "link": "https://github.com/sheelfer-a"},
    {"title": "Sample Project 2", "desc": "Replace this with your HTML and CSS project, for example a personal web page.",
     "tags": ["Web"], "link": "https://github.com/sheelfer-a"},
]
# ===============================================

@app.route("/")
def home():
    return render_template("index.html", p=PROFILE, edu=EDUCATION, skills=SKILLS)

@app.get("/api/projects")
def projects():
    return jsonify(PROJECTS)

@app.post("/api/contact")
def contact():
    d = request.get_json(silent=True) or {}
    name, email, msg = (d.get(k, "").strip() for k in ("name", "email", "message"))
    if not (name and email and msg):
        return jsonify(ok=False, error="Please fill all fields."), 400
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify(ok=False, error="Please enter a valid email."), 400
    if len(msg) > 2000 or len(name) > 100:
        return jsonify(ok=False, error="Message is too long."), 400
    with open(MSG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps({"time": time.strftime("%Y-%m-%d %H:%M:%S"), "name": name,
                            "email": email, "message": msg}, ensure_ascii=False) + "\n")
    return jsonify(ok=True)

@app.route("/resume")
def resume():
    path = os.path.join(BASE, "static", "resume.pdf")
    if not os.path.exists(path):
        return "Resume coming soon. Add resume.pdf to the static folder.", 404
    return send_from_directory(os.path.join(BASE, "static"), "resume.pdf", as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
