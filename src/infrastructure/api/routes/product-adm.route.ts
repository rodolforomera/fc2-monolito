import express, { Request, Response } from 'express';
import ProductRepository from '../../../modules/product-adm/repository/product.repository';
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase';
import CheckStockUseCase from '../../../modules/product-adm/usecase/check-stock/check-stock.usecase';
import ProductAdmPresenter from '../presenters/product-adm.presenter';

export const productAdmRoute = express.Router();

productAdmRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new AddProductUseCase(new ProductRepository());
    try {
        const productDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        };
        const output = await usecase.execute(productDto);
        res.send(output);
    }catch (err) {
        if (err instanceof Error) {
            res.status(400).send(err.message);
        }else{
            res.status(500).send(err);
        }
    }
});

productAdmRoute.get("/check-stock/:id", async (req: Request, res: Response) => {
    const usecase = new CheckStockUseCase(new ProductRepository());

    const productDto = {
        productId: req.params.id
    }
    const output = await usecase.execute(productDto);

    res.format({
        json: () => res.send(output),
        xml: async () => res.send(ProductAdmPresenter.checkStockXML(output)),
    });
});