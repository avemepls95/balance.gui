import { DebtDto } from '../Dto/DebtDto';
import { Debt } from '../Debt';
import { User } from '../../User';

export class DebtsDtoMapper {
    static convertDtoToDebt(debtDto: DebtDto): Debt {
        return new Debt ({
            user: new User({ id: debtDto.user.id, username: debtDto.user.username }),
            amount: debtDto.value
        })
    }
}