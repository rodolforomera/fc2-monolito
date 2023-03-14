import { toXML } from "jstoxml";
import { CheckStockOutputDto } from "../../../modules/product-adm/usecase/check-stock/check-stock.dto";

export default class ProductAdmPresenter {

    static checkStockXML(data: CheckStockOutputDto): string {

        const xmlOption =  {
            header: true,
            indent: " ",
            newline: "\n",
            allowEmpty: true,
        }

        return toXML(
            {
                product: {
                    productId: data.productId,
                    stock: data.stock
                }, 
            },
            xmlOption
        );

    } 

}