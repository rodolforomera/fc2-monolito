import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";
import { ClientModel as ClientAdmModel } from "../../client-adm/repository/client-model";
import ClientOrderModel from "../repository/client.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import ProductOrderModel from "./product.model";
import { OrderItemModel } from "./order-item.model";
import { OrderModel } from "./order.model";
import { migrator } from "../../../infrastructure/db/sequelize/config/migrator";
import { Umzug } from "umzug";


describe("CheckoutRepository test", () => {

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        
        sequelize.addModels([OrderModel, OrderItemModel, 
            ClientAdmModel, ClientOrderModel,
            ProductAdmModel, ProductStoreModel, ProductOrderModel]);
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
        
        const repository = new CheckoutRepository();

        const client = await ClientAdmModel.create({
            id: "1",
            name: "Client 1",
            email: "x@x.com",
            document: "123456789",
            street: "Address 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "ZipCode 1",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product1 = await ProductAdmModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            purchasePrice: 10,
            stock: 50,
            createdAt: new Date(),
            updateAt: new Date(),
        });

        const product2 = await ProductAdmModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            purchasePrice: 20,
            stock: 50,
            createdAt: new Date(),
            updateAt: new Date(),
        });
        
        await ProductStoreModel.update({
            salesPrice: 20,
        }, {
            where: {
                id: product1.id
            }
        });

        await ProductStoreModel.update({
            salesPrice: 30,
        }, {
            where: {
                id: product2.id
            }
        });

        const productStore1 = await ProductStoreModel.findOne({ where: { id: product1.id }});
        const productStore2 = await ProductStoreModel.findOne({ where: { id: product2.id }});
        
        const order = new Order({
            id: new Id("1"),
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                address: client.street,
            }),
            products: [
                new Product({
                    id: new Id(productStore1.id),
                    name: productStore1.name,
                    description: productStore1.description,
                    salesPrice: productStore1.salesPrice,
                }),
                new Product({
                    id: new Id(productStore2.id),
                    name: productStore2.name,
                    description: productStore2.description,
                    salesPrice: productStore2.salesPrice,
                }),
            ],
            status: "approved",
        });

        await repository.addOrder(order);

        const result = await OrderModel.findOne({
            where: { id: "1" },
            include: [{ model: OrderItemModel, include: [{ model: ProductOrderModel }] }, 
                      { model: ClientOrderModel }],
        });

        expect(result).toBeDefined();
        expect(result.id.toString()).toBe(order.id.id.toString());
        expect(result.status).toBe(order.status);
        expect(result.client.id.toString()).toEqual(order.client.id.id.toString());
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.client.address).toBe(order.client.address);
        expect(result.items[0].product_id.toString()).toBe(order.products[0].id.id.toString());
        expect(result.items[0].product.name).toBe(order.products[0].name);
        expect(result.items[0].product.description).toBe(order.products[0].description);
        expect(result.items[0].product.salesPrice).toBe(order.products[0].salesPrice);
        expect(result.items[1].product_id.toString()).toBe(order.products[1].id.id.toString());
        expect(result.items[1].product.name).toBe(order.products[1].name);
        expect(result.items[1].product.description).toBe(order.products[1].description);
        expect(result.items[1].product.salesPrice).toBe(order.products[1].salesPrice);

    });

    it("should find an order", async () => {

        const repository = new CheckoutRepository();

        const client = await ClientAdmModel.create({
            id: "1",
            name: "Client 1",
            email: "x@x.com",
            document: "123456789",
            street: "Address 1",
            number: "1",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "ZipCode 1",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const product1 = await ProductAdmModel.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            purchasePrice: 10,
            stock: 50,
            createdAt: new Date(),
            updateAt: new Date(),
        });

        const product2 = await ProductAdmModel.create({
            id: "2",
            name: "Product 2",
            description: "Description 2",
            purchasePrice: 20,
            stock: 50,
            createdAt: new Date(),
            updateAt: new Date(),
        });
        
        await ProductStoreModel.update({
            salesPrice: 20,
        }, {
            where: {
                id: product1.id
            }
        });

        await ProductStoreModel.update({
            salesPrice: 30,
        }, {
            where: {
                id: product2.id
            }
        });

        const productStore1 = await ProductStoreModel.findOne({ where: { id: product1.id }});
        const productStore2 = await ProductStoreModel.findOne({ where: { id: product2.id }});
        
        const order = new Order({
            id: new Id("1"),
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                address: client.street,
            }),
            products: [
                new Product({
                    id: new Id(productStore1.id),
                    name: productStore1.name,
                    description: productStore1.description,
                    salesPrice: productStore1.salesPrice,
                }),
                new Product({
                    id: new Id(productStore2.id),
                    name: productStore2.name,
                    description: productStore2.description,
                    salesPrice: productStore2.salesPrice,
                }),
            ],
            status: "approved",
        });

        await repository.addOrder(order);

        const result = await repository.findOrder(order.id.id);

        expect(result).toBeDefined();
        expect(result.id.id.toString()).toBe(order.id.id.toString());
        expect(result.status).toBe(order.status);
        expect(result.client.id.id.toString()).toEqual(order.client.id.id.toString());
        expect(result.client.name).toBe(order.client.name);
        expect(result.client.email).toBe(order.client.email);
        expect(result.client.address).toBe(order.client.address);
        expect(result.products[0].id.id.toString()).toBe(order.products[0].id.id.toString());
        expect(result.products[0].name).toBe(order.products[0].name);
        expect(result.products[0].description).toBe(order.products[0].description);
        expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice);
        expect(result.products[1].id.id.toString()).toBe(order.products[1].id.id.toString());
        expect(result.products[1].name).toBe(order.products[1].name);
        expect(result.products[1].description).toBe(order.products[1].description);
        expect(result.products[1].salesPrice).toBe(order.products[1].salesPrice);

    });

});