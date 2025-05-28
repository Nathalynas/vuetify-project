const API_BASE = 'https://estagio.almt.app'

function getAccountId() {
  return localStorage.getItem('accountId')
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products?account_id=${getAccountId()}`, {
    credentials: 'include',
  })
  return res.json()
}

export async function createProduct(product) {
  return fetch(`${API_BASE}/product?account_id=${getAccountId()}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, url: null }),
  })
}

export async function updateProduct(id, product) {
  return fetch(`${API_BASE}/product/update?product_id=${id}&account_id=${getAccountId()}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, url: null }),
  })
}

export async function deleteProduct(id) {
  return fetch(`${API_BASE}/product/${id}?account_id=${getAccountId()}`, {
    method: 'DELETE',
    credentials: 'include',
  })
}
