import type { IProduct } from '@/api'

interface CartItem {
    product: IProduct;
    quantity: number;
}

export const addToCart = (product: IProduct, quantity: number = 1): void => {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    let found = cart.find(item => item.product?.id === product.id);

    if (found) {
        found.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

export const getCart = (): CartItem[] => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

export const updateCart = (cart: CartItem[]): void => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeFromCart = (productId: string): void => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter((item: CartItem) => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
};
