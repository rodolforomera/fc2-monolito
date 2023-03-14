import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {

    async findAll(): Promise<Product[]> {
        const products = await ProductModel.findAll();
        return products.map((product) => 
            new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            })
        ); 
    }
    
    async find(id: string): Promise<Product | null> {
        const product = await ProductModel.findOne({
            where: {
                id: id,
            },
        });
        
        if (product) {
            return new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            });
        }else{
            return null;
        }
    }
    
    async update(product: Product): Promise<void> {

        await ProductModel.update({
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }, {
            where: {
                id: product.id.id
            }
        });

    }
    
}