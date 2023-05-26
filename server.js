const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));


app.get('/api/quotes/random', (req, res, next) => {
  const randomQuote = getRandomElement(quotes)
  res.send({quote: randomQuote})
})

app.get('/api/quotes', (req, res, next) => {
  const { person } = req.query
  let allPersonQuotes = []
  if(person) {
    quotes.filter(quote => {
      if(quote.person.includes(person)) {
        allPersonQuotes.push(quote)
      }
    })
    res.send({quotes: allPersonQuotes})
  }
  else {
    res.send({quotes})
  }
})

app.post('/api/quotes', (req, res, next) => {
  if(req.query) {
    const newQuote = {quote: req.query.quote, person: req.query.person}
    quotes.push(newQuote)
    res.send({quotes: newQuote})
  }
  else {
    res.status(400).send()
  }
})

app.put('/api/quotes/:id', (req, res, next) => {
  let { id } = req.params
  let quoteToUpdate = quotes.findIndex(quote => quote.id === Number(id))
  if(quoteToUpdate !== -1) {
    quotes[quoteToUpdate] = {quote: req.query.quote, person: req.query.person, id: Number(req.query.id)}
    res.send({quotes: quotes[quoteToUpdate]})
  }
  else {
    res.status(400).send()
  }
})

app.delete('/api/quotes/:id', (req, res, next) => {
  const { id } = req.params
  const quoteToDelete = quotes.findIndex(quote => quote.id === Number(id))
  if(quoteToDelete !== -1) {
    quotes.splice(quoteToDelete, 1)
    res.status(204).send()
  }
  else {
    res.status(404).send()
  }
})


app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`)
})