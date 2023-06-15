import { Expense } from '../models/expense.js';


export function createExpense(json) {
    return new Expense(
        json.title,
        Number(json.price),
        new Date(json.date).toISOString()
    );
}