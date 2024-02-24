import time
import sqlite3
from codechat.database.utils import fetch_all_rows
from ctransformers import AutoModelForCausalLM
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin

path = "D:\Documents\Models\llama2.7b.luna-ai.gguf_v2.q4_k_m.gguf"

llm = AutoModelForCausalLM.from_pretrained(path, model_type="llama", gpu_layers=50)

app = Flask(__name__) # Initialize the flask App

cors = CORS(app, resource={
    r"/*":{
        "origins":"http://localhost:3000"
    }
})
app.config['CORS_HEADERS'] = 'Content-Type'

# Set gpu_layers to the number of layers to offload to GPU. Set to 0 if no GPU acceleration is available on your system.
model = AutoModelForCausalLM.from_pretrained(path, model_type="llama", gpu_layers=50)

@app.route('/chats', methods=['GET'])
def list_chats():
    return fetch_all_rows(
        "SELECT * FROM chats ORDER BY created_at DESC;", 
        error_msg=lambda e: print(f"Failed to list all chats with error:", e)
    )

@app.route('/chat/new', methods=['POST'])
def create_chat():
    conn = sqlite3.connect("database.db")
    try:
        created_at = int(time.time())

        data =  request.get_json()
        if "name" in data:
            name = data["name"]
        else:
            name = "New Chat"

        cur = conn.cursor()
        
        query = """
        INSERT INTO chats (name, created_at)
        VALUES (?, ?);
        """
        cur.execute(query, (name, created_at,))

        conn.commit()

    except Exception as e:
        print("Failed to create chat with error:", e)
        conn.rollback()
    
    finally:
        conn.close()
        return {}

@app.route('/chat/<chat_id>/history', methods=['GET'])
def get_chat_history(chat_id):
    return fetch_all_rows(
        "SELECT * FROM messages WHERE chat_id = ? AND layer = 0;", 
        error_msg=lambda e: print(f"Failed to get messages for chat {chat_id} with error:", e)
    )

@app.route('/chat/<chat_id>/edit', methods=['POST'])
def edit_chat(chat_id):
    conn = sqlite3.connect("database.db")
    try:
        data =  request.get_json()
        if "name" in data:
            name = data["name"]

        cur = conn.cursor()
        
        query = """
        UPDATE chats
        SET name = ?
        WHERE id = ?;
        """
        cur.execute(query, (name, chat_id,))

        conn.commit()

    except Exception as e:
        print("Failed to update chat with error:", e)
        conn.rollback()
    
    finally:
        conn.close()
        return {}

@app.route('/chat/<chat_id>/delete', methods=['POST'])
def delete_chat(chat_id):
    conn = sqlite3.connect("database.db")
    try:
        cur = conn.cursor()
        
        query = """
        DELETE FROM chats
        WHERE id = ?;
        """
        cur.execute(query, (chat_id,))

        conn.commit()

    except Exception as e:
        print("Failed to delete chat with error:", e)
        conn.rollback()
    
    finally:
        conn.close()
        return {}


if __name__ == "__main__":
    app.run(debug=True)