import type { UserIcon } from "../models/UserIcon";
import * as _userIconDto from "./dto/UserIconDto";

export class UserIconIndexedDBService {
    static async getById(userIconCollectionId: string, userIconId: string): Promise<UserIcon> {
        return UserIconIndexedDBService.getById(userIconCollectionId, userIconId);
    }
}