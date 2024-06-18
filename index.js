const express = require('express')
const app = express()
require('dotenv').config()
const Phone = require('./models/mongo')

app.use(express.static('dist'))

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path:   ', req.path)
    console.log('Body:   ', req.body)
    console.log('---')
    next()
}
const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

const cors = require('cors')
app.use(cors())
app.use(express.json())
// app.use(requestLogger)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (req, res) => {
    Phone.find({}).then(phoneBook => {
        res.json(phoneBook)
    })
})
app.get('/info', (req, res) => {
    var date = new Date();
    let len = Phone.length
    res.send(`<p>Phonebook has info for ${len} people</p><p>${date}</p>`)
})
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Phone.findById(id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Phone.findByIdAndDelete(id)
        .then(p => {
            res.status(204).end()
        })
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id, body = req.body;

    const person = {
        name: body.name,
        number: body.number
    }
    Phone.findByIdAndUpdate(id, person, { new: true })
        .then(newPerson => {
            res.json(newPerson)
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Missing name and/or Number'
        })
    }
    const newPerson = new Phone({
        name: body.name,
        number: body.number,
    })
    newPerson.save()
        .then(newObj => {
            res.json(newObj)
        })
        .catch(err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})