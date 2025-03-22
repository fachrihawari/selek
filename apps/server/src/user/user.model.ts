import { IMongoloquentSchema, Mongoloquent } from 'mongoloquent';
import { TUserSchema } from './user.schema';

export interface IUserSchema extends TUserSchema, IMongoloquentSchema {}

export class UserModel extends Mongoloquent {
    public static $collection: string = 'users';
    public static $timestamps: boolean = true;
    public static $schema: IUserSchema
}
