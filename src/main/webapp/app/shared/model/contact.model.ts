import { IDebt } from 'app/shared/model/debt.model';
import { IUser } from 'app/core/user/user.model';

export interface IContact {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  debts?: IDebt[];
  user?: IUser;
}

export class Contact implements IContact {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public phoneNumber?: string,
    public debts?: IDebt[],
    public user?: IUser
  ) {}
}
