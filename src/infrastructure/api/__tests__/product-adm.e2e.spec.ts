import express, { Express } from 'express'
import request from "supertest";
import { productAdmRoute } from "../routes/product-adm.route";
import { migrator } from "../../db/sequelize/config/migrator";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { ProductModel } from '../../../modules/product-adm/repository/product.model';

describe("E2E test for product/adm", () => {

    const app: Express = express();
    app.use(express.json());
    app.use("/product/adm", productAdmRoute);

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        
        sequelize.addModels([ProductModel]);
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

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 100.50,
                stock: 50
            });
        
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.description).toBe("Description Product 1");
        expect(response.body.purchasePrice).toBe(100.50);
        expect(response.body.stock).toBe(50);
    });
    
    it("should return stock", async () => {

        const response = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 100.50,
                stock: 50
            });
        
        expect(response.status).toBe(200);

        console.log(response);
        
        const responseStock = await request(app).get(`/product/adm/check-stock/${response.body.id}`).send();
        expect(responseStock.status).toBe(200);

        expect(responseStock.body.productId).toBe(response.body.id);
        expect(responseStock.body.stock).toBe(50);

        const cResponseXML = await request(app)
            .get(`/product/adm/check-stock/${response.body.id}`)
            .set("Accept", "application/xml")
            .send()
        expect(cResponseXML.status).toBe(200);
        expect(cResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(cResponseXML.text).toContain(`<product>`);
        expect(cResponseXML.text).toContain(`<productId>${responseStock.body.productId}</productId>`);
        expect(cResponseXML.text).toContain(`<stock>50</stock>`);

    });

});