import express from 'express';
import { createExpense } from '../functions/createExpense.js'; 

const app = express();
const port = 5000;

const expenses = [];
let dayLimit = 0;


app.use(express.json());
app.listen(port, () => {
    console.log(`Server has been started on port ${port}`);
});


app.post('/expense', (request, response) => {
    if (!request.body.title) {
        return response.status(400).send({error: "There is no title in the body"});
    } else if (!request.body.price) {
        return response.status(400).send({error: "There is no price in the body"});
    } else if (!request.body.date) {
        return response.status(400).send({error: "There is no date in the body"});
    } else if (dayLimit - request.body.price < 0) {
        return response.status(400).send({error: "Limit is exceeded!"});
    }

    if (typeof request.body.title !== 'string') {
        return response.status(400).send({error: "Title must be a string"});
    }
    if (typeof request.body.price !== 'number') {
        return response.status(400).send({error: "Price must be a number"});
    }
    if (typeof request.body.date !== 'string') {
        return response.status(400).send({error: "Date must be a string"});
    }

    let expense = createExpense(request.body);
    expenses.push(expense);
    dayLimit -= expense.price;

    return response.sendStatus(200);
});

app.get('/expenses', (request, response) => {
    if (expenses.length === 0) {
        return response.status(400).send({error: "There is no expenses"});
    }

    return response.send(expenses);
});

app.post('/search-expenses', (request, response) => {
    if (!request.body.date) {
        return response.status(400).json({error: "There is no date in the body"});
    }

    if (isNaN(Date.parse(request.body.date))) {
        return response.status(400).json({error: "Date must be valid"});
    }

    let searchDate = new Date(request.body.date).toISOString();
    let sortedExpenses = expenses.filter( (value) => value.date === searchDate );
    
    if (sortedExpenses.length === 0) {
        return response.status(400).send({error: `There is no expenses at ${request.body.date}`});
    }

    return response.send(sortedExpenses);
});

app.post('/limit', (request, response) => {
    if (!request.body.limit) {
        return response.status(400).send({error: "There is no limit in the body"});
    }
    if (typeof request.body.limit !== 'number') {
        return response.status(400).send({error: "Limit must be a number"});
    }

    dayLimit = request.body.limit;
    return response.sendStatus(200);
});

app.get('/limit', (request, response) => {
    return response.send({limit: dayLimit});
});