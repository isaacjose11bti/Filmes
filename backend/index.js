import express from "express"
import mysql2 from "mysql2"

const app = express()

app.use(express.json())

const sql = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes03MB"
})


app.get("/", (request, response) => {
    response.json({
        message: "Filmes"
    })
})


app.get("/all-films", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_LaraFreitasIsaacJose"

    sql.query(selectCommand, (error, filmes) => {
        if (error) {
            console.log(error)

            return response.status(500).json({
                error: "Erro ao buscar filmes",
                detalhe: error.message
            })
        }

        response.json(filmes)
    })
})

app.post("/create-film", (request, response) => {

    console.log("Dados recebidos:", request.body)

    const { titulo, genero, duracao, classificacao } = request.body

    if (
        titulo === undefined ||
        genero === undefined ||
        duracao === undefined ||
        classificacao === undefined
    ) {
        return response.status(400).json({
            error: "Preencha todos os campos"
        })
    }

    const insertCommand = `
        INSERT INTO filmes_LaraFreitasIsaacJose
        (titulo, genero, duracao, classificacao)
        VALUES (?, ?, ?, ?)
    `

    sql.query(
        insertCommand,
        [titulo, genero, duracao, classificacao],
        (error, resultado) => {

            if (error) {
                console.log(error)

                return response.status(500).json({
                    error: "Erro ao cadastrar filme",
                    detalhe: error.message
                })
            }

            response.status(201).json({
                message: "Filme cadastrado!",
                id: resultado.insertId
            })
        }
    )
})

app.delete("/delete-film/:id", (request, response) => {

    const { id } = request.params

    const deleteCommand = `
        DELETE FROM filmes_LaraFreitasIsaacJose
        WHERE id = ?
    `

    sql.query(deleteCommand, [id], (error) => {

        if (error) {
            console.log(error)

            return response.status(500).json({
                error: "Erro ao deletar filme",
                detalhe: error.message
            })
        }

        response.json({
            message: "Filme deletado!"
        })
    })
})


app.put("/update-film/:id", (request, response) => {

    const { id } = request.params
    const { titulo, genero, duracao, classificacao } = request.body

    if (
        titulo === undefined ||
        genero === undefined ||
        duracao === undefined ||
        classificacao === undefined
    ) {
        return response.status(400).json({
            error: "Envie titulo, genero, duracao e classificacao"
        })
    }

    const updateCommand = `
        UPDATE filmes_LaraFreitasIsaacJose
        SET titulo = ?, genero = ?, duracao = ?, classificacao = ?
        WHERE id = ?
    `

    const valores = [
        titulo,
        genero,
        duracao,
        classificacao,
        id
    ]

    sql.query(updateCommand, valores, (error) => {

        if (error) {
            console.log(error)

            return response.status(500).json({
                error: "Erro ao atualizar o filme",
                detalhe: error.message
            })
        }

        response.json({
            message: "Filme atualizado!"
        })
    })
})


app.listen(3000, () => {
    console.log("Filmes Bem-Vindo!")
})