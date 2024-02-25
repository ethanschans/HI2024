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

        data = request.get_json()
        #TODO
        # name = "string_name"
        name = data["name"]

        path = data["path"]

        cur = conn.cursor()

        #Check for duplicate; if duplicate, return name
        query = "SELECT * FROM repo WHERE path = \"" + path + "\";"
        rows = cur.execute(query).fetchall()
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

# @app.route("/repo/update", method='POST')
# def repo_update():
#     return "<p>Hello, World!</p>"

@app.route("/repos", methods=['GET'])
def repos():
    return fetch_all_rows(
        "SELECT * FROM repo;", 
        error_msg=lambda e: print(f"Failed to get repository list with error:", e)
    )

@app.route("/history/create", methods=['POST'])
def history_create():
    conn = sqlite3.connect("database.db")
    
    role = "HISTORY"
    try:    

        data = request.get_json()
        #TODO
        role = data["role"]
        message = data["message"]
        # role = "string_role"
        # message = "YYY"
        path = data["path"]

        cur = conn.cursor()

        #Check for duplicate; if duplicate, return name
        query = "SELECT * FROM history WHERE path = \"" + path + "\";"
        rows = cur.execute(query).fetchall()
        if(len(rows) > 0):
            return {
                "role": rows[0][2]
            }        


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
        return {
            "role": role,
        }

@app.route("/history/get", methods=['GET'])
def history_get():
    return fetch_all_rows(
        "SELECT * FROM history;", 
        error_msg=lambda e: print(f"Failed to get history list with error:", e)
    )