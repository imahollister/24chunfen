import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Download } from 'lucide-react';
import { dataManager } from '../../services/DataManager';
import { Product, Order } from '../../types';
import { DataTable } from '../../components/admin/DataTable';
import { Drawer } from '../../components/admin/Drawer';

export default function ShopManager() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts([...dataManager.getShopProducts()]);
    setOrders([...dataManager.getOrders()]);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "订单ID,商品名称,消耗豆子,收货人,电话,状态,兑换时间\n"
      + orders.filter(o => o.type !== 'lottery').map(item => 
          `${item.id},${item.productName},${item.amount},${item.address?.name},${item.address?.phone},${item.status},${item.time}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shop_redemption_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveProduct = () => {
    if (!currentProduct.name || !currentProduct.price) return;

    const newProduct: Product = {
      id: currentProduct.id || Date.now().toString(),
      type: 'merchandise',
      name: currentProduct.name,
      description: currentProduct.description || '',
      price: Number(currentProduct.price),
      currency: 'beans',
      stock: Number(currentProduct.stock) || 0,
      images: currentProduct.images || ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gift%20box%20minimalist&image_size=square'],
      displayOrder: products.length + 1,
      isActive: true,
      createdAt: currentProduct.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...currentProduct
    } as Product;

    dataManager.saveShopProduct(newProduct);
    refreshData();
    setIsDrawerOpen(false);
    setCurrentProduct({});
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个商品吗？')) {
      dataManager.deleteShopProduct(id);
      refreshData();
    }
  };

  const productColumns = [
    {
      header: '商品信息',
      accessor: (item: Product) => (
        <div className="flex items-center gap-3">
          <img src={item.images[0]} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
          <div>
            <div className="font-bold text-gray-800">{item.name}</div>
            <div className="text-xs text-gray-400">{item.description}</div>
          </div>
        </div>
      )
    },
    {
      header: '兑换价格 (豆)',
      accessor: (item: Product) => <span className="font-bold text-orange-500">{item.price}</span>
    },
    {
      header: '库存',
      accessor: 'stock' as keyof Product
    },
    {
      header: '操作',
      accessor: (item: Product) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => { setCurrentProduct(item); setIsDrawerOpen(true); }}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(item.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      className: 'text-right'
    }
  ];

  const orderColumns = [
    {
      header: '订单ID',
      accessor: (item: Order) => <span className="text-gray-500 font-mono text-xs">{item.id}</span>
    },
    {
      header: '商品名称',
      accessor: (item: Order) => (
        <span className="font-bold text-gray-800">
            {item.productName}
            {item.amount === 0 && <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">奖品</span>}
        </span>
      )
    },
    {
      header: '消耗豆子',
      accessor: (item: Order) => <span className="text-orange-500 font-bold">{item.amount > 0 ? item.amount : '免费'}</span>
    },
    {
      header: '收货人',
      accessor: (item: Order) => (
        <div>
          <div>{item.address?.name}</div>
          <div className="text-xs text-gray-400">{item.address?.phone}</div>
        </div>
      )
    },
    {
      header: '时间',
      accessor: 'time' as keyof Order
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            商品管理
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            兑换记录
          </button>
        </div>

        {activeTab === 'products' ? (
          <button
            onClick={() => { setCurrentProduct({}); setIsDrawerOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            添加商品
          </button>
        ) : (
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            导出记录
          </button>
        )}
      </div>

      {activeTab === 'products' && (
        <DataTable 
          data={products}
          columns={productColumns}
          searchPlaceholder="搜索商品..."
        />
      )}

      {activeTab === 'orders' && (
        <DataTable 
          data={orders.filter(o => o.type !== 'lottery')}
          columns={orderColumns}
          searchPlaceholder="搜索订单..."
        />
      )}

      {/* Edit Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={currentProduct.id ? '编辑商品' : '添加商品'}
        footer={
          <>
            <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button onClick={handleSaveProduct} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">商品名称</label>
            <input 
              value={currentProduct.name || ''} 
              onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="请输入商品名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">商品描述</label>
            <textarea 
              value={currentProduct.description || ''} 
              onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="请输入商品描述"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">兑换价格 (豆)</label>
              <input 
                type="number"
                value={currentProduct.price || ''} 
                onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">库存数量</label>
              <input 
                type="number"
                value={currentProduct.stock || ''} 
                onChange={e => setCurrentProduct({...currentProduct, stock: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">商品图片 URL</label>
            <input 
              value={currentProduct.images?.[0] || ''} 
              onChange={e => setCurrentProduct({...currentProduct, images: [e.target.value]})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              placeholder="https://..."
            />
            {currentProduct.images?.[0] && (
              <div className="mt-4 border border-gray-200 rounded-lg p-2 bg-gray-50 inline-block">
                <img src={currentProduct.images[0]} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
