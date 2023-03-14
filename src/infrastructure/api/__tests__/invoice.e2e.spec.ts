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
import { invoiceRoute } from "../routes/invoice.route";


describe("E2E test for order", () => {
    
    const app: Express = express();
    app.use(express.json());
    app.use("/client", clientRoute);
    app.use("/product/adm", productAdmRoute);
    app.use("/product/store", productStoreRoute);
    app.use("/checkout", checkOutRoute);
    app.use("/invoice", invoiceRoute);

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

    it("should get an invoice", async () => {

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

        const responseOrder = await request(app)
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
        
        expect(responseOrder.status).toBe(200);

        const response = await request(app)
            .get(`/invoice/${responseOrder.body.invoiceId}`).send();
        expect(response.status).toBe(200);

        expect(response.body.id).toBe(responseOrder.body.invoiceId);
        expect(response.body.name).toBe(responseClient1.body.name);
        expect(response.body.document).toBe(responseClient1.body.document);
        expect(response.body.address.street).toBe(responseClient1.body.street);
        expect(response.body.address.number).toBe(responseClient1.body.number);
        expect(response.body.address.complement).toBe(responseClient1.body.complement);
        expect(response.body.address.city).toBe(responseClient1.body.city);
        expect(response.body.address.state).toBe(responseClient1.body.state);
        expect(response.body.address.zipCode).toBe(responseClient1.body.zipCode);

        expect(response.body.items.length).toBe(2);

        expect(response.body.items[0].id).toBe(responseProduct1.body.id);
        expect(response.body.items[0].name).toBe(responseProduct1.body.name);
        expect(response.body.items[0].price).toBe(responseUpdate1.body.salesPrice);

        expect(response.body.items[1].id).toBe(responseProduct2.body.id);
        expect(response.body.items[1].name).toBe(responseProduct2.body.name);
        expect(response.body.items[1].price).toBe(responseUpdate2.body.salesPrice);

        expect(response.body.total).toBe(201);
        
    });

});