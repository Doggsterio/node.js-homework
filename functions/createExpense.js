import { Expense } from '../models/expense.js';


export function createExpense(json) {
    return new Expense(
        json.title,
        Number(json.price),
        String(json.date)
    );
}