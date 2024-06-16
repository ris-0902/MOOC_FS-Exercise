const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    var date = new Date();
    let len = persons.length
    res.send(`<p>Phonebook has info for ${len} people</p><p>${date}</p>`)
})
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const note = persons.find(p => p.id === Number(id))
    if (!note) res.status(404).end()
    else res.json(note)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.sendStatus(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Missing name and/or Number'
        })
    }
    let flg = false
    persons.map(p => p.name === body.name ? flg = true : flg = flg)
    if (flg) {
        return res.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(body)
})

const PORT = 30001
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})