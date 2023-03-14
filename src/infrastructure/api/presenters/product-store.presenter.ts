import { toXML } from "jstoxml";
import { FindAllProductsDto } from "../../../modules/store-catalog/usecase/find-all-products/find-all-products.dto";
import { FindProductOutputDto } from "../../../modules/store-catalog/usecase/find-product/find-product.dto";

export default class ProductStorePresenter {

    static find(data: FindProductOutputDto): string {

        const xmlOption =  {
            header: true,
            indent: " ",
            newline: "\n",
            allowEmpty: true,
        }

        return toXML(
            {
                product: {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    salesPrice: data.salesPrice,
                }, 
            },
            xmlOption
        );

    } 

    static findAll(data: FindAllProductsDto) {

        const xmlOption =  {
            header: true,
            indent: " ",
            newline: "\n",
            allowEmpty: true,
        }

        return toXML(
            {
                products: {
                    product: data.products.map((product) => ({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        salesPrice: product.salesPrice,
                    })),
                },
            }, 
            xmlOption
        );

    }

}