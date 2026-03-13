
export interface Barcode {
    _id: string;
    id: string;
    barcode: string;
    name: string;
    scans: number;
    imageUrl: string;
    category: string;
    productTypeId?: string; // 👈 nuevo campo
    createdAt: Date;
    updatedAt: Date;
}
