export enum Status {
    AVAILABLE = "AVAILABLE",
    SOLD = "SOLD",
    PRICE_AGREED = "PRICE_AGREED"
}
export interface IVehicle {
    type: string;
    id: string;
    make: string;
    model: string;
    regNo: string;
    regDate: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}
export const VEHICLE_PK = 'Vehicle'