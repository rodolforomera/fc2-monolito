import express, { Express } from 'express'
import request from "supertest";
import { migrator } from "../../db/sequelize/config/migrator";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { productStoreRoute } from '../routes/product-store.route';
import { ProductModel as ProductAdmModel } from '../../../modules/product-adm/repository/product.model';
import ProductStoreModel from '../../../modules/store-catalog/repository/product.model';
import { productAdmRoute } from '../routes/product-adm.route';

describe("E2E test for product/store", () => {

    const app: Express = express();
    app.use(express.json());
    app.use("/product/adm", productAdmRoute);
    app.use("/product/store", productStoreRoute);

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        
        sequelize.addModels([ProductAdmModel, ProductStoreModel]);
        migration = migrator(sequelize);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await migration.up();
    });

    afterEach(async () => {
        await migration.down({to: '2023.03.09T16.09.19.create-table-product.ts'});
    });

    it("should find a product", async () => {
        
        const responseCreate = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 100.50,
                stock: 50
            });
        expect(responseCreate.status).toBe(200);

        const responseSale = await request(app).get(`/product/store/${responseCreate.body.id}`).send();
        expect(responseSale.status).toBe(200);

        expect(responseSale.body.name).toBe("Product 1");
        expect(responseSale.body.description).toBe("Description Product 1");

    });

    it("should find all products", async () => {
        
        const responseCreate1 = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 100.50,
                stock: 50
            });
        expect(responseCreate1.status).toBe(200);

        const responseCreate2 = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 2",
                description: "Description Product 2",
                purchasePrice: 101.50,
                stock: 51
            });
        expect(responseCreate2.status).toBe(200);

        const responseProducts = await request(app).get(`/product/store`).send();
        expect(responseProducts.status).toBe(200);

        console.log(responseProducts.body);

        expect(responseProducts.body.products.length).toBe(2);
        
        const product = responseProducts.body.products[0];
        expect(product.name).toBe("Product 1");

        const product2 = responseProducts.body.products[1];
        expect(product2.name).toBe("Product 2");

    });

    it("should update sales price", async () => {
        
        const responseCreate = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 100.50,
                stock: 50
            });
        expect(responseCreate.status).toBe(200);

        const responseUpdate = await request(app)
            .put(`/product/store/sales-price/${responseCreate.body.id}`)
            .send({
                salesPrice: 100
            });
        expect(responseUpdate.status).toBe(200);

        const responseSale = await request(app).get(`/product/store/${responseCreate.body.id}`).send();
        expect(responseSale.status).toBe(200);

        expect(responseSale.body.name).toBe("Product 1");
        expect(responseSale.body.description).toBe("Description Product 1");
        expect(responseSale.body.salesPrice).toBe(100);

    });

});