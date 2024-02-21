import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getNotes(){
    const [rows] = await pool.query("select * from notes")
    return rows
   
}
export async function getNote(id){
    const [rows] = await pool.query(`
    SELECT * 
    FROM notes
    WHERE id = ?
    `,[id])
    return rows[0]

}

//insert function
export async function createNote(title, content){
    const [result] = await pool.query(`INSERT INTO notes (title, contents)
    values (?,?)
    `,[title, content]) 
    const id = result.insertId
    return getNote(id)

    
}

//function update
export async function updateNote(id, { title, content }) {
    try {
        const [result] = await pool.query('UPDATE notes SET title = ?, contents = ? WHERE id = ?', [title, content, id]);

        
        if (result.affectedRows > 0) {
           
            const updatedNote = await getNote(id);
            return updatedNote;
        } else {
            
            return null;
        }
    } catch (error) {
        
        throw error;
    }
}
//function delete
export async function deleteNote(id) {
    try {
        const [result] = await pool.query('DELETE FROM notes WHERE id = ?', [id]);

       
        if (result.affectedRows > 0) {
           
            return { deletedNoteID: id };
        } else {
           
            return null;
        }
    } catch (error) {
      
        throw error;
    }
}