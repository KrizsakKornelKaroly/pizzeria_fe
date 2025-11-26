export interface CartItem {
    id: number;
    userId: number;
    userName: string;
    pizzaId: number;
    pizzaName: string;
    price: number;
    amount: number;
    total: number;
}