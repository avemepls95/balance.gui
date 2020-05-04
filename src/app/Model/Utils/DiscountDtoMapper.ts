import { DISCOUNT_TYPE_DTO } from '../Dto/Check/discount-type-dto.enum';
import { DISCOUNT_TYPE } from '../Discount/discount-type.enum';

export class DiscountTypeDtoMapper {

    static convertTypeToDto(discountType: DISCOUNT_TYPE): DISCOUNT_TYPE_DTO {
        return discountType == DISCOUNT_TYPE.ABSOLUTE ?
            DISCOUNT_TYPE_DTO.ABSOLUTE : DISCOUNT_TYPE_DTO.RELATIVE;
    }

    static convertDtoToType(discountType: DISCOUNT_TYPE_DTO): DISCOUNT_TYPE {
        return discountType == DISCOUNT_TYPE_DTO.ABSOLUTE ?
            DISCOUNT_TYPE.ABSOLUTE : DISCOUNT_TYPE.PERCENT;
    }
}