import { toXML } from "jstoxml";
import { FindClientOutputDto } from "../../../modules/client-adm/usecase/find-client/find-client.usecase.dto";

export default class ClientPresenter {

    static checkStockXML(data: FindClientOutputDto): string {

        const xmlOption =  {
            header: true,
            indent: " ",
            newline: "\n",
            allowEmpty: true,
        }

        return toXML(
            {
                client: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    document: data.document,
                    street: data.street,
                    number: data.number,
                    complement: data.complement,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                }, 
            },
            xmlOption
        );

    } 

}