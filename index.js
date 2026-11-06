const express = require("express")
const mysql = require("mysql2/promise")
const app = express()
app.use(express.json())

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "admin",
    port: 3307,
    database: "escola"
})

//PROFESSORES

app.get("/professores", async (req, res) => {
    const [professores] = await db.execute("SELECT * FROM professores")
    return res.json(professores)
})

app.post("/professores", async (req, res) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).json({ error: "Nome do professor é obrigatório" })
    }

    if (nome.length <= 2) {
        return res.status(400).json({ error: "Nome do professor deve ter mais de 2 caracteres" })
    }

    const [resultado] = await db.execute("INSERT INTO professores (nome) VALUES (?)", [nome])
    return res.status(201).json({id: resultado.insertId, nome})

})

app.post("/cursos", async (req, res) => {
    const { nome, id_professor } = req.body

    if (!nome || !id_professor) {
        return res.status(400).json({ error: "Nome do curso e ID do professor são obrigatórios" })
    }

    const [resultado] = await db.execute("INSERT INTO cursos (nome, id_professor) VALUES (?, ?)", [nome, id_professor])
    return res.status(201).json({id: resultado.insertId, nome})
})

app.listen(3000, () => console.log("API no ar"))