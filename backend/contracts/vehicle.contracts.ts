import { Status } from "../models/vehicle-model";

export namespace Contracts {
    export interface CreateVehicle {
        make: string;
        model: string;
        regNo: string;
        regDate: string;
    }

    export interface UpdateVehicle {
        id: string;
        make: string;
        model: string;
        regNo: string;
        regDate: string;
        status: Status;
    }

    export interface DeleteVehicle {
        id: string;
    }
}
