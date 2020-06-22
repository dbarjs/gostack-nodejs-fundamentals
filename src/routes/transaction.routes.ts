import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    return response.json({
      transactions: transactionsRepository.all(),
      balance: transactionsRepository.getBalance(),
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    // get
    const { title, value, type } = request.body;

    // parse
    const parsedValue = parseFloat(value);

    if (type !== 'income' && type !== 'outcome') {
      return response.status(500).json({ error: 'Parse error' });
    }

    // create service
    const createTransactionService = new CreateTransactionService(
      transactionsRepository,
    );

    // run service
    const transaction = createTransactionService.execute({
      title,
      value: parsedValue,
      type,
    });

    // return
    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
