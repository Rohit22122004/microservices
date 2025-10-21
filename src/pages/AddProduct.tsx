import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AddProduct: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [inStock, setInStock] = useState(true);
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = {
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      category,
      stockQuantity: parseInt(stockQuantity),
      inStock,
      colors: colors.split(',').map(c => c.trim()),
      sizes: sizes.split(',').map(s => s.trim()),
      isFeatured,
    };

    try {
      const res = await fetch('http://localhost:8082/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (res.ok) {
        toast.success('Product added successfully!');
        // Clear form
        setName('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        setCategory('');
        setStockQuantity('');
        setColors('');
        setSizes('');
        setInStock(true);
        setIsFeatured(false);
      } else {
        const err = await res.text();
        toast.error('Failed to add product: ' + err);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while adding the product.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <div>
          <label className="block text-sm font-medium mb-1">In Stock?</label>
          <select
            value={inStock ? 'true' : 'false'}
            onChange={(e) => setInStock(e.target.value === 'true')}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Colors (comma separated)"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Sizes (comma separated)"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="form-checkbox h-5 w-5 text-primary-600"
            />
            <span className="ml-2 text-gray-700">Featured Product</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-md font-semibold"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
