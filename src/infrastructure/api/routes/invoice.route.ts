import express, { Request, Response } from 'express';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';
import FindInvoiceUseCase from '../../../modules/invoice/usecase/find/find.usecase';

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {

    try {

        const usecase = new FindInvoiceUseCase(new InvoiceRepository());

        const invoiceDto = {
            id: req.params.id
        }
        const output = await usecase.execute(invoiceDto);

        res.format({
            json: () => res.send(output),
            //xml: async () => res.send(ClientPresenter.checkStockXML(output)),
        });

    }catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message);
        }else{
            res.status(500).send(err);
        }
    }
    
});