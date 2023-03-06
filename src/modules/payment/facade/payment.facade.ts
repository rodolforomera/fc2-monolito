import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, ProcessFacadePaymentOutputDto } from "./facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {

    constructor(private processPaymentUseCase: UseCaseInterface) {
    }
    
    async process(input: PaymentFacadeInputDto): Promise<ProcessFacadePaymentOutputDto> {
        return await this.processPaymentUseCase.execute(input);
    }

}