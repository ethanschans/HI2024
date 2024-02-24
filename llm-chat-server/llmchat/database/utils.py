import sqlite3

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