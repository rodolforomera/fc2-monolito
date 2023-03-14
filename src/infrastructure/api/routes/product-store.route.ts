import express, { Request, Response } from 'express';
import ProductRepository from '../../../modules/store-catalog/repository/product.repository';
import FindAllProductsUseCase from '../../../modules/store-catalog/usecase/find-all-products/find-all-products.usecase';
import FindProductUseCase from '../../../modules/store-catalog/usecase/find-product/find-product.usecase';
import UpdateSalesPriceUseCase from '../../../modules/store-catalog/usecase/update-sales-price/update-sales-price.usecase';
import ProductStorePresenter from '../presenters/product-store.presenter';

export const productStoreRoute = express.Router();

productStoreRoute.put("/sales-price/:id", async (req: Request, res: Response) => {
    const usecase = new UpdateSalesPriceUseCase(new ProductRepository);
    try {
        const productDto = {
            id: req.params.id,
            salesPrice: req.body.salesPrice
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

productStoreRoute.get("/:id", async (req: Request, res: Response) => {
    const usecase = new FindProductUseCase(new ProductRepository());

    const productDto = {
        id: req.params.id
    }
    const output = await usecase.execute(productDto);

    res.format({
        json: () => res.send(output),
        xml: async () => res.send(ProductStorePresenter.find(output)),
    });
});

productStoreRoute.get("/", async (req: Request, res: Response) => {
    const usecase = new FindAllProductsUseCase(new ProductRepository());

    const output = await usecase.execute();

    res.format({
        json: () => res.send(output),
        xml: async () => res.send(ProductStorePresenter.findAll(output)),
    });
});