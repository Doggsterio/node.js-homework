import express from 'express';
import { Expense } from '../models/expense.js';
import { createExpense } from '../functions/createExpense.js'; 

const app = express();
const port = 5000;

const expenses = [];
let dayLimit = 0;


app.use(express.json());
app.listen(port, () => {
    console.log(`Server has been started on port $(port)`);
});


app.post('/expense', (request, response) => {
    expenses.push( createExpense(request.body) );
    response.send('OK');
});

app.get('/all-expenses', (request, response) => {
    if (expenses.length !== 0) {
        response.send(expenses);
    } else {
        response.send("There is no expenses");
    }
});

app.post('/search-expenses', (request, response) => {
    let sortedExpenses = expenses.filter( (value) => String(value.date) === request.body.date );
    
    if (sortedExpenses.length !== 0) {
        response.send(sortedExpenses);
    } else {
        response.send(`There is no expenses at ${request.body.date}`);
    }
});

app.post('/set-limit', (request, response) => {
    dayLimit = request.body.limit;
    response.send('OK');
});

app.get('/limit', (request, response) => {
    response.send(String(`Your day limit is ${dayLimit}`));
});