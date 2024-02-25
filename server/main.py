from flask import Flask, request
import sqlite3
#from codechat.database.utils import fetch_all_rows

app = Flask(__name__)

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def fetch_all_rows(query, error_msg, database_path="database.db"):
    conn = sqlite3.connect(database_path)
    rows = []
    try:
        conn.row_factory = dict_factory
        cur = conn.cursor()
        cur.execute(query)
        rows = cur.fetchall()
    except Exception as e:
        error_msg(e)
    finally:
        conn.close()
        return rows


@app.route("/repo/create", methods=['POST'])
def repo_create():
    conn = sqlite3.connect("database.db")
    
    name = "REPOSITORY"
    try:
        #TODO check if exsists, if so return name
        data = request.get_json()
        #TODO
        name = "string_name"

        path = data["path"]

        cur = conn.cursor()
        
        query = """
        INSERT INTO repo (name, path)
        VALUES (?, ?);
        """
        cur.execute(query, (name, path,))

        conn.commit()

    except Exception as e:
        print("Failed to create repo with error:", e)
        conn.rollback()
    
    finally:
        conn.close()
        return {
            "name": name,
        }

# @app.route("/repo/update", method='POST')
# def repo_update():
#     return "<p>Hello, World!</p>"

@app.route("/repos", methods=['GET'])
def repos():
    return fetch_all_rows(
        "SELECT * FROM repo;", 
        error_msg=lambda e: print(f"Failed to get repository list with error:", e)
    )
