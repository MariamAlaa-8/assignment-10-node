import { UserModel } from "../../DB/models/user.model";
import { DatabaseRepository } from "./base.repository";



type TUserDoc = any; 

class UserRepository extends DatabaseRepository<TUserDoc> {
  constructor() {

    super(UserModel);
  }


}

export const userRepository = new UserRepository();