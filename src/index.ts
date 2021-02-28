import * as functions from 'firebase-functions'
import * as express from 'express'
import { addEntry } from './entryController'
import { addOrder, cancelOrder, updateOrder } from './orderEntry'
import { initMeal } from './mealEntry'
import { initStat } from './statEntry'

const app = express()

app.get('/', (req, res) => res.status(200).send('Hey there!'))
app.post('/entries', addEntry)
app.post('/orders', addOrder)
app.post('/initStat', initStat)
app.post('/meals', initMeal)
app.patch('/entries/:entryId', updateOrder)
app.delete('/entries/:entryId', cancelOrder)
exports.app = functions.https.onRequest(app)