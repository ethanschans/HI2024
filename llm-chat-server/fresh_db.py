import sqlite3

# Connecting to sqlite

# connection object
connection_obj = sqlite3.connect('database.db')

# cursor object
cursor_obj = connection_obj.cursor()

# Drop the table if already exists.
cursor_obj.execute("DROP TABLE IF EXISTS chats")

# Creating table
table = """ CREATE TABLE chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(256) NOT NULL,
            created_at INTEGER NOT NULL
        ); """


cursor_obj.execute(table)


# Drop the table if already exists.
cursor_obj.execute("DROP TABLE IF EXISTS messages")

# Creating table
table = """ CREATE TABLE messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            FOREIGN KEY (chat_id) REFERENCES chats(id),
            prev_message_id INTEGER,
            layer INTEGER NOT NULL,
            has_more_layers BOOLEAN NOT NULL CHECK (mycolumn IN (0, 1)),
            used BOOLEAN NOT NULL CHECK (mycolumn IN (0, 1)),
            speaker VARCHAR(256) NOT NULL,
            content VARCHAR(512)
        ); """

cursor_obj.execute(table)
# Close the connection
connection_obj.close()