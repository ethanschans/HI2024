from flask import Flask, request
import sqlite3
from flask_cors import CORS
import urllib.parse

app = Flask(__name__)
cors = CORS(app, resources={
    r"/*": {
        "origins": "*", 
        }
    })

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
    
    name = "Repository"
    try:    

        data = request.get_json()
        #TODO
        name = data["path"]

        path = data["path"]

        cur = conn.cursor()

        # Check for duplicate; if duplicate, return name
        query = "SELECT * FROM repo WHERE path = ?;"
        rows = cur.execute(query, (path,)).fetchall()
        if(len(rows) > 0):
            return {
                "name": rows[0][1]
            }        
        
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

@app.route("/repos", methods=['GET'])
def repos():
    return fetch_all_rows(
        "SELECT * FROM repo;", 
        error_msg=lambda e: print(f"Failed to get repository list with error:", e)
    )

@app.route("/history/create", methods=['POST'])
def history_create():
    conn = sqlite3.connect("database.db")
    
    role = "Unknown"
    try:    

        data = request.get_json()
        role = data["role"]
        message = data["message"]
        path = data["path"]

        cur = conn.cursor()    

        query = """
        INSERT INTO history (message, path, role)
        VALUES (?, ?, ?);
        """
        cur.execute(query, (message, path, role,))

        conn.commit()

    except Exception as e:
        print("Failed to create history with error:", e)
        conn.rollback()
    
    finally:
        conn.close()
    return {}

@app.route("/history/<path>", methods=['GET'])
def history(path):
    path = urllib.parse.unquote(path)
    conn = sqlite3.connect("database.db")
    rows = []
    try:
        cur = conn.cursor()

        query = "SELECT * FROM history WHERE path = ?;"
        rows = cur.execute(query, (path,)).fetchall()
    
        cur.execute(query, (path,))

        conn.commit()

    except Exception as e:
        print("Failed to get history with error:", e)
        conn.rollback()
    
    finally:
        conn.close()
        return rows

if __name__ == "__main__":
    app.run(debug=True)