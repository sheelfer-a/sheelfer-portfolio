# Sheelfer A - Portfolio (Flask)
Run locally:
    pip install -r requirements.txt
    python app.py        # open http://127.0.0.1:5000
Edit your details in app.py (PROFILE, PROJECTS). Put your resume as static/resume.pdf.
Contact messages are saved in messages.jsonl.
Deploy: Render.com -> New Web Service -> Build: pip install -r requirements.txt, Start: gunicorn app:app
