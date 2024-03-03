export interface User
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    role?: string;
    firstname: string;
    lastname: string;

    addressId:string;
    address_line_1:string;
    address_line_2:string;
    city:string;
    suburb:string;
    zip_postal_code:string;
    country:string;


}
