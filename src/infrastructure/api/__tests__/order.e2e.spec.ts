import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import request from "supertest";
import { Umzug } from "umzug";
import { migrator } from "../../db/sequelize/config/migrator";
import { checkOutRoute } from "../routes/checkout.route";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../../modules/checkout/repository/order-item.model";
import ClientOrderModel from "../../../modules/checkout/repository/client.model";
import ProductOrderModel from "../../../modules/checkout/repository/product.model";
import { ProductModel as ProductAdmModel } from '../../../modules/product-adm/repository/product.model';
import ProductStoreModel from '../../../modules/store-catalog/repository/product.model';
import { productAdmRoute } from "../routes/product-adm.route";
import { productStoreRoute } from "../routes/product-store.route";
import { ClientModel } from "../../../modules/client-adm/repository/client-model";
import { clientRoute } from "../routes/client.route";
import { TransactionModel } from "../../../modules/payment/repository/transaction.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/item.model";


describe("E2E test for order", () => {
    
    const app: Express = express();
    app.use(express.json());
    app.use("/client", clientRoute);
    app.use("/product/adm", productAdmRoute);
    app.use("/product/store", productStoreRoute);
    app.use("/checkout", checkOutRoute);

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        
        sequelize.addModels([
            ClientModel,
            ProductAdmModel,
            ProductStoreModel,
            TransactionModel,
            OrderModel, OrderItemModel, ClientOrderModel, ProductOrderModel,
            InvoiceModel, InvoiceItemModel]);
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

    it("should add a order", async () => {

        const responseClient1 = await request(app)
            .post("/client")
            .send({
                name: "Client 1",
                document: "1234",
                email: "client1@email.com",
                street: "Street 1",
                number: "Number 1",
                complement: "Complement 1",
                city: "City 1",
                state: "State 1",
                zipCode: "03940000"
            });
        expect(responseClient1.status).toBe(200);

        const responseProduct1 = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 1",
                description: "Description Product 1",
                purchasePrice: 100.50,
                stock: 50
            });
        expect(responseProduct1.status).toBe(200);

        const responseProduct2 = await request(app)
            .post("/product/adm")
            .send({
                name: "Product 2",
                description: "Description Product 2",
                purchasePrice: 101.50,
                stock: 51
            });
        expect(responseProduct2.status).toBe(200);

        // Update sales price
        const responseUpdate1 = await request(app)
            .put(`/product/store/sales-price/${responseProduct1.body.id}`)
            .send({
                salesPrice: 100
            });
        expect(responseUpdate1.status).toBe(200);

        const responseUpdate2 = await request(app)
            .put(`/product/store/sales-price/${responseProduct2.body.id}`)
            .send({
                salesPrice: 101
            });
        expect(responseUpdate2.status).toBe(200);

        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: responseClient1.body.id,
                products: 
                [
                    {
                        id: responseProduct1.body.id,
                    },
                    {
                        id: responseProduct2.body.id,
                    },
                ]
            });
        
        expect(response.status).toBe(200);

        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toBe("approved");
        expect(response.body.total).toBe(201);
        expect(response.body.products.length).toBe(2);

        expect(response.body.products[0].productId).toBe(responseProduct1.body.id);
        expect(response.body.products[1].productId).toBe(responseProduct2.body.id);
    });

    it("should not create a order", async () => {
        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "1",
            });
        
        expect(response.status).toBe(400);
    });

});