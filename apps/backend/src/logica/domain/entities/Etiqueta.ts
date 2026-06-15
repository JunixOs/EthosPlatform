export class Etiqueta {
    private _id: string;
    private _nombre: string;

    private _slug: string;

    private _creadoEn: Date;
    
    constructor(
        id: string,
        nombre: string,
        slug: string,
        creadoEn: Date
    ) {
        this._id = id;
        this._nombre = nombre;
        this._slug = slug;
        this._creadoEn = creadoEn;
    }

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    public get nombre(): string {
        return this._nombre;
    }
    public set nombre(value: string) {
        this._nombre = value;
    }

    public get slug(): string {
        return this._slug;
    }
    public set slug(value: string) {
        this._slug = value;
    }

    public set creadoEn(value: Date) {
        this._creadoEn = value;
    }

    public get creadoEn(): Date {
        return this._creadoEn;
    }
}