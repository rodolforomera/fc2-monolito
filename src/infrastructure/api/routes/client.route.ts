import express, { Request, Response } from 'express';
import ClientRepository from '../../../modules/client-adm/repository/client.repository';
import AddClientUsecase from '../../../modules/client-adm/usecase/add-client/add-client.usecase';
import FindClientUsecase from '../../../modules/client-adm/usecase/find-client/find-client.usecase';
import ClientPresenter from '../presenters/client.presenter';

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new AddClientUsecase(new ClientRepository());
    try {
        const clientDto = {
            name: req.body.name,
            document: req.body.document,
            email: req.body.email,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        };
        const output = await usecase.execute(clientDto);
        res.send(output);
    }catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message);
        }else{
            res.status(500).send(err);
        }
    }
});

clientRoute.get("/:id", async (req: Request, res: Response) => {
    const usecase = new FindClientUsecase(new ClientRepository());

    const clientDto = {
        id: req.params.id
    }
    const output = await usecase.execute(clientDto);

    res.format({
        json: () => res.send(output),
        xml: async () => res.send(ClientPresenter.checkStockXML(output)),
    });
});