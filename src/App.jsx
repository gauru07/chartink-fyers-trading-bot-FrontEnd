import React, { useState } from 'react';
import axios from 'axios';

const TradingDashboard = () => {
  const [form, setForm] = useState({
    // Time
    start_time: '',
    end_time: '',

    // Buy Setup
    buy_target: '',
    buy_stoplimit_enabled: false,
    buy_stoplimit_target: '',

    // Sell Setup
    sell_target: '',
    sell_stoplimit_enabled: false,
    sell_stoplimit_target: '',

    // Instant Entry
    instant_entry: false,
    instant_buffer: '',

    // Stoplimit Buffers
    buy_entry_buffer: '',
    stoploss_buffer: '',

    // Lock & Trail for Instant Entry
    instant_lock_trigger: '',
    instant_lock_profit: '',
    instant_step: '',
    instant_trail: '',

    // Lock & Trail for StopLimit Entry
    stoplimit_lock_trigger: '',
    stoplimit_lock_profit: '',
    stoplimit_step: '',
    stoplimit_trail: '',

    // Capital
    capital_used: '',
  });

  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://chartink-fyers-trading-bot.onrender.com/api/chartink-alert", form);
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Failed to submit order" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 p-6 bg-white rounded shadow">

      <h2 className="font-bold text-lg">Trading Time</h2>
      <input name="start_time" value={form.start_time} onChange={handleChange} placeholder="Start Time (e.g. 9:34)" className="w-full p-2 border rounded" />
      <input name="end_time" value={form.end_time} onChange={handleChange} placeholder="End Time (e.g. 14:56)" className="w-full p-2 border rounded" />

      <h2 className="font-bold text-lg mt-4">Buy Setup (1 Min)</h2>
      <input name="buy_target" value={form.buy_target} onChange={handleChange} placeholder="Buy Target Value" className="w-full p-2 border rounded" />
      <label className="block">
        <input type="checkbox" name="buy_stoplimit_enabled" checked={form.buy_stoplimit_enabled} onChange={handleChange} className="mr-2" />
        Enable StopLimit Entry for Buy
      </label>
      <input name="buy_stoplimit_target" value={form.buy_stoplimit_target} onChange={handleChange} placeholder="Buy StopLimit Target" className="w-full p-2 border rounded" />

      <h2 className="font-bold text-lg mt-4">Sell Setup (1 Min)</h2>
      <input name="sell_target" value={form.sell_target} onChange={handleChange} placeholder="Sell Target Value" className="w-full p-2 border rounded" />
      <label className="block">
        <input type="checkbox" name="sell_stoplimit_enabled" checked={form.sell_stoplimit_enabled} onChange={handleChange} className="mr-2" />
        Enable StopLimit Entry for Sell
      </label>
      <input name="sell_stoplimit_target" value={form.sell_stoplimit_target} onChange={handleChange} placeholder="Sell StopLimit Target" className="w-full p-2 border rounded" />

      <h2 className="font-bold text-lg mt-4">Instant Buy/Sell Entry</h2>
      <label className="block">
        <input type="checkbox" name="instant_entry" checked={form.instant_entry} onChange={handleChange} className="mr-2" />
        Enable Instant Buy/Sell Entry
      </label>
      <input name="instant_buffer" value={form.instant_buffer} onChange={handleChange} placeholder="Instant Entry Buffer (e.g. 0.09)" className="w-full p-2 border rounded" />

      <h2 className="font-bold text-lg mt-4">StopLimit Entry Buffers</h2>
      <input name="buy_entry_buffer" value={form.buy_entry_buffer} onChange={handleChange} placeholder="Buy Entry Buffer" className="w-full p-2 border rounded" />
      <input name="stoploss_buffer" value={form.stoploss_buffer} onChange={handleChange} placeholder="Stoploss Buffer" className="w-full p-2 border rounded" />

      <h2 className="font-bold text-lg mt-4">Lock & Trail (Instant Entry)</h2>
      <input name="instant_lock_trigger" value={form.instant_lock_trigger} onChange={handleChange} placeholder="If Profit Reaches (Instant)" className="w-full p-2 border rounded" />
      <input name="instant_lock_profit" value={form.instant_lock_profit} onChange={handleChange} placeholder="Lock Profit % (Instant)" className="w-full p-2 border rounded" />
      <input name="instant_step" value={form.instant_step} onChange={handleChange} placeholder="Increment Step Value (Instant)" className="w-full p-2 border rounded" />
      <input name="instant_trail" value={form.instant_trail} onChange={handleChange} placeholder="Trail Profit % (Instant)" className="w-full p-2 border rounded" />

      <h2 className="font-bold text-lg mt-4">Lock & Trail (StopLimit Entry)</h2>
      <input name="stoplimit_lock_trigger" value={form.stoplimit_lock_trigger} onChange={handleChange} placeholder="If Profit Reaches (StopLimit)" className="w-full p-2 border rounded" />
      <input name="stoplimit_lock_profit" value={form.stoplimit_lock_profit} onChange={handleChange} placeholder="Lock Profit % (StopLimit)" className="w-full p-2 border rounded" />
      <input name="stoplimit_step" value={form.stoplimit_step} onChange={handleChange} placeholder="Increment Step Value (StopLimit)" className="w-full p-2 border rounded" />
      <input name="stoplimit_trail" value={form.stoplimit_trail} onChange={handleChange} placeholder="Trail Profit % (StopLimit)" className="w-full p-2 border rounded" />

      <h2 className="font-bold text-lg mt-4">Capital Settings</h2>
      <input name="capital_used" value={form.capital_used} onChange={handleChange} placeholder="Capital Used (e.g. 5000)" className="w-full p-2 border rounded" />

      <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Submit Order</button>

      {response && (
        <pre className="bg-gray-100 p-2 text-sm rounded border mt-2">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </form>
  );
};

export default TradingDashboard;
