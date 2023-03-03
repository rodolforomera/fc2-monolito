import Id from "../value-object/id.value-object";

export default class BaseEntity {
    private _id: Id;
    private _createdAt: Date;
    private _updateAt: Date;

    constructor(id?: Id) {
        this._id = id;
        this._createdAt = new Date();
        this._updateAt = new Date();
    }

    get id(): Id {
        return this._id;
    }

    get createAt(): Date {
        return this._createdAt;
    }

    get updateAt(): Date {
        return this._updateAt;
    }

    set updateAt(updateAt: Date) {
        this._updateAt = updateAt;
    }
}