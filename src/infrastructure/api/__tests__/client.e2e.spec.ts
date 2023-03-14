import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import request from "supertest";
import { clientRoute } from "../routes/client.route";
import { Umzug } from "umzug";
import { ClientModel } from "../../../modules/client-adm/repository/client-model";
import { migrator } from "../../db/sequelize/config/migrator";


describe("E2E test for client", () => {
    
    const app: Express = express();
    app.use(express.json());
    app.use("/client", clientRoute);

    let sequelize: Sequelize;

    let migration: Umzug<any>;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        });
        
        sequelize.addModels([ClientModel]);
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

    it("should create a client", async () => {
        const response = await request(app)
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
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toBe("Client 1");
        expect(response.body.document).toBe("1234");
        expect(response.body.email).toBe("client1@email.com");
        expect(response.body.street).toBe("Street 1");
        expect(response.body.number).toBe("Number 1");
        expect(response.body.complement).toBe("Complement 1");
        expect(response.body.city).toBe("City 1");
        expect(response.body.state).toBe("State 1");
        expect(response.body.zipCode).toBe("03940000");
    });

    it("should not create a client", async () => {
        const response = await request(app)
            .post("/client")
            .send({
                name: "Client 1",
            });
        
        expect(response.status).toBe(400);
    });

    it("should find a client", async () => {
        
        const response = await request(app)
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
        expect(response.status).toBe(200);

        const cResponse = await request(app).get(`/client/${response.body.id}`).send();
        expect(cResponse.status).toBe(200);
        
        expect(cResponse.body.name).toBe("Client 1");
        expect(cResponse.body.street).toBe("Street 1");

        const cResponseXML = await request(app)
            .get(`/client/${response.body.id}`)
            .set("Accept", "application/xml")
            .send()
        expect(cResponseXML.status).toBe(200);
        expect(cResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(cResponseXML.text).toContain(`<client>`);
        expect(cResponseXML.text).toContain(`<name>Client 1</name>`);
        expect(cResponseXML.text).toContain(`<street>Street 1</street>`);
    
    });

});