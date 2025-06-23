// ✅ FRONTEND: Updated React component with toggle + conditional UI
import React, { useState } from 'react';
import axios from 'axios';

const TradingDashboard = () => {
  const [form, setForm] = useState({
    testLogicOnly: false,
    stocks: '',
    trigger_prices: '',
    type: 'Market',
    capital: 100000,
    buffer: 0.09,
    risk: 0.1,
    risk_reward: 1.5,
    lot_size: 1.0,
    enable_instant: true,
    enable_stoplimit: true,
    enable_lockprofit: false
  });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...form,
        triggered_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const res = await axios.post("https://chartink-fyers-trading-bot.onrender.com/api/chartink-alert", payload);
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || { error: "Unknown error" });
    }
  };

  const isTestMode = form.testLogicOnly;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-6 bg-white rounded shadow">
      <label className="block">
        <input type="checkbox" name="testLogicOnly" checked={form.testLogicOnly} onChange={handleChange} className="mr-2" />
        <span className="font-medium">Test Logic Only (Use Dummy Symbol & Price)</span>
      </label>

      {!isTestMode && (
        <>
          <input name="stocks" value={form.stocks} onChange={handleChange} placeholder="Symbol" className="w-full p-2 border rounded" />
          <input name="trigger_prices" value={form.trigger_prices} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" />
          <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="Market">Market</option>
            <option value="Limit">Limit</option>
          </select>
        </>
      )}

      <input name="capital" value={form.capital} onChange={handleChange} placeholder="Capital" className="w-full p-2 border rounded" />
      <input name="buffer" value={form.buffer} onChange={handleChange} placeholder="Buffer %" className="w-full p-2 border rounded" />
      <input name="risk" value={form.risk} onChange={handleChange} placeholder="Risk %" className="w-full p-2 border rounded" />
      <input name="risk_reward" value={form.risk_reward} onChange={handleChange} placeholder="Risk Reward" className="w-full p-2 border rounded" />
      <input name="lot_size" value={form.lot_size} onChange={handleChange} placeholder="Lot Size" className="w-full p-2 border rounded" />

      <label><input type="checkbox" name="enable_instant" checked={form.enable_instant} onChange={handleChange} className="mr-2" /> Enable Instant Entry (Market)</label>
      <label><input type="checkbox" name="enable_stoplimit" checked={form.enable_stoplimit} onChange={handleChange} className="mr-2" /> Enable Stop Limit Entry</label>
      <label><input type="checkbox" name="enable_lockprofit" checked={form.enable_lockprofit} onChange={handleChange} className="mr-2" /> Enable Lock Profit Logic</label>

      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Order</button>

      {error && <p className="text-red-500">❌ Error: {error.error}</p>}
      {response && (
        <pre className="bg-gray-100 p-2 text-sm rounded border mt-2">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </form>
  );
};

export default TradingDashboard;
