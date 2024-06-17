import { ref, onMounted } from 'vue';

export function useCart() {
    const cartItemCount = ref(0);

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
        cartItemCount.value = itemCount;
    }

    onMounted(updateCartCount);

    window.addEventListener('storage', (event) => {
        if (event.key === 'cart') {
            updateCartCount();
        }
    });

    return { cartItemCount };
}
