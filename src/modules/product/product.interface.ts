
export interface Barcode {
    _id: string;
    barcode: string;
    name: string;
    scans: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}