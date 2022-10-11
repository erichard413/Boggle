from curses import reset_prog_mode, reset_shell_mode
from boggle import Boggle
from flask import Flask, request, render_template, session, redirect, jsonify

app = Flask(__name__)

app.config['SECRET_KEY'] = "secret"

boggle_game = Boggle()

@app.route('/')
def index():
    """Show homepage."""
    boggle_board = boggle_game.make_board()
    session["boggle_board"] = boggle_board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    return render_template("index.html", board = boggle_board, highscore=highscore, nplays=nplays)

@app.route('/guess')
def submit_guess():
    """User submits guess"""
    word = request.args.get("word")
    board = session["boggle_board"]
    result = boggle_game.check_valid_word(board, word)
    return jsonify(result=result)

@app.route('/submit-score', methods=["POST"])
def save_game():
    """User saves game stats"""
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)
    return jsonify(brokeRecord=score > highscore)

@app.route('/end-game')
def restart_game():
    """re-initiates game"""
    return redirect('/')