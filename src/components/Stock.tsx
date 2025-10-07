import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
}

const Stock: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "PRODUTO 1" },
    { id: 2, name: "PRODUTO 2" },
    { id: 3, name: "PRODUTO 3" },
    { id: 4, name: "PRODUTO 4" },
    { id: 5, name: "PRODUTO 5" },
    { id: 6, name: "PRODUTO 6" },
    { id: 7, name: "PRODUTO 7" },
    { id: 8, name: "PRODUTO 8" },
    { id: 9, name: "PRODUTO 9" },
    { id: 10, name: "PRODUTO 10" },
    { id: 11, name: "PRODUTO 11" },
    { id: 12, name: "PRODUTO 12" },
  ]);

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  );

  const handleAdd = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleAddItem = () => {
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts([...products, { id: newId, name: `PRODUTO ${newId}` }]);
    setQuantities((prev) => ({ ...prev, [newId]: 0 }));
  };

  const handleEdit = (id: number) => {
    console.log(`Edit product with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-20">
      <div className="bg-placeholder p-5 rounded-lg font-sans w-300">
        <div className="pb-5 border-b-6 border-division flex justify-between">
          <h1 className="text-black font-extrabold text-5xl text-left mb-2">
            <span className="mr-5"></span>Gerenciamento de estoque
          </h1>
          <button
            onClick={handleAddItem}
            className="px-4.5 py-2 mr-4 text-center text-white text-3xl font-bold bg-division rounded-full hover:bg-division/70"
          >
            +
          </button>
        </div>
        <ul>
          {products.map((product) => (
            <li
              key={product.id}
              className="flex justify-between items-center py-5 border-b-6 border-division"
            >
              <span className="text-gray-800">
                <span className="mr-8"></span>
                {product.id}. {product.name}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleAdd(product.id)}
                  className="px-2.5 py-1 text-white font-bold bg-division rounded-full hover:bg-division/70"
                >
                  +
                </button>
                <button
                  onClick={() => handleEdit(product.id)}
                  className="px-2 py-1"
                >
                  {quantities[product.id] || 0}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-2.5 py-1 text-white font-bold bg-division rounded-full hover:bg-division/70"
                >
                  -
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Stock;