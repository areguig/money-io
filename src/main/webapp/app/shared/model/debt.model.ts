import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IContact } from 'app/shared/model/contact.model';
import { Currency } from 'app/shared/model/enumerations/currency.model';
import { Owner } from 'app/shared/model/enumerations/owner.model';

export interface IDebt {
  id?: number;
  amount?: number;
  currency?: Currency;
  comment?: string;
  owner?: Owner;
  closed?: boolean;
  created?: Moment;
  dueDate?: Moment;
  user?: IUser;
  contact?: IContact;
}

export class Debt implements IDebt {
  constructor(
    public id?: number,
    public amount?: number,
    public currency?: Currency,
    public comment?: string,
    public owner?: Owner,
    public closed?: boolean,
    public created?: Moment,
    public dueDate?: Moment,
    public user?: IUser,
    public contact?: IContact
  ) {
    this.closed = this.closed || false;
  }
}
