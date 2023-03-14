import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { OrderItemModel } from "../../modules/checkout/repository/order-item.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { ClientModel } from "../../modules/client-adm/repository/client-model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import ProductStoreModel  from "../../modules/store-catalog/repository/product.model";
import { checkOutRoute } from "./routes/checkout.route";
import { clientRoute } from "./routes/client.route";
import { productAdmRoute } from "./routes/product-adm.route";
import { productStoreRoute } from "./routes/product-store.route";
import ClientOrderModel from "../../modules/checkout/repository/client.model";
import ProductOrderModel from "../../modules/checkout/repository/product.model";
import { invoiceRoute } from "./routes/invoice.route";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/item.model";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";

export const app: Express = express();
app.use(express.json());
app.use("/product/adm", productAdmRoute);
app.use("/product/store", productStoreRoute);
app.use("/client", clientRoute);
app.use("/checkout", checkOutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite',
        logging: true,
    });
    sequelize.addModels([ProductModel, 
        ProductStoreModel, 
        ClientModel,
        OrderModel, OrderItemModel, ClientOrderModel, ProductOrderModel,
        TransactionModel,
        InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
}
setupDb();