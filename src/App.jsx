import { useState } from "react";
import axios from "axios";

export default function App() {
  const [symbol, setSymbol] = useState("");
  const [price, setPrice] = useState("");
  const [side, setSide] = useState("long");
  const [type, setType] = useState("2");
  const [capital, setCapital] = useState("100000");
  const [bufferInstant, setBufferInstant] = useState("0.09");
  const [bufferLimit, setBufferLimit] = useState("0.10");
  const [rr, setRR] = useState("1.5");
  const [risk, setRisk] = useState("1.0");
  const [status, setStatus] = useState("");
  const [enableInstant, setEnableInstant] = useState(true);
  const [enableLimit, setEnableLimit] = useState(true);
  const [enableLockProfit, setEnableLockProfit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://chartink-fyers-trading-bot.onrender.com/api/chartink-alert", {
        alert_id: `A-${Date.now()}`,
        stocks: symbol,
        trigger_prices: parseFloat(price),
        side,
        timestamp: new Date().toISOString(),
        type: parseInt(type),
        strategy: "shoot1",
        capital: parseFloat(capital),
        buffer: parseFloat(type === "2" ? bufferInstant : bufferLimit),
        risk_reward: parseFloat(rr),
        risk_percent: parseFloat(risk),
        enableInstant,
        enableLimit,
        enableLockProfit
      });
      setStatus(`✅ Order Sent. Qty: ${res.data.qty}, Entry: ₹${res.data.entry}, SL: ₹${res.data.sl}, TP: ₹${res.data.tp}`);
    } catch (err) {
      console.error(err);
      setStatus("\u274C Error placing order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-1">🚀 Chartink-Fyers Algo Bot</h1>
        <p className="text-sm text-center text-gray-500 mb-4">Automated Order Placement via Chartink Alerts</p>

        <input type="text" placeholder="Stock Symbol (e.g., TATAMOTORS)" className="w-full p-3 mb-3 border rounded"
          value={symbol} onChange={(e) => setSymbol(e.target.value)} required />

        <input type="number" placeholder="Trigger Price" className="w-full p-3 mb-3 border rounded"
          value={price} onChange={(e) => setPrice(e.target.value)} required />

        <select className="w-full p-3 mb-3 border rounded" value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>

        <select className="w-full p-3 mb-3 border rounded" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="2">Market</option>
          <option value="1">Limit</option>
        </select>

        <input type="number" placeholder="Capital (₹)" className="w-full p-3 mb-3 border rounded"
          value={capital} onChange={(e) => setCapital(e.target.value)} required />

        <input type="number" step="0.01" placeholder="Buffer % (Instant)" className="w-full p-3 mb-3 border rounded"
          value={bufferInstant} onChange={(e) => setBufferInstant(e.target.value)} />

        <input type="number" step="0.01" placeholder="Buffer % (Limit)" className="w-full p-3 mb-3 border rounded"
          value={bufferLimit} onChange={(e) => setBufferLimit(e.target.value)} />

        <input type="number" step="0.1" placeholder="Risk-Reward Ratio (e.g. 1.5)" className="w-full p-3 mb-3 border rounded"
          value={rr} onChange={(e) => setRR(e.target.value)} required />

        <input type="number" step="0.1" placeholder="Risk % per Trade (e.g. 1.0)" className="w-full p-3 mb-4 border rounded"
          value={risk} onChange={(e) => setRisk(e.target.value)} required />

        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableInstant} onChange={() => setEnableInstant(!enableInstant)} />
            Enable Instant Entry
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableLimit} onChange={() => setEnableLimit(!enableLimit)} />
            Enable Stop Limit Entry
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enableLockProfit} onChange={() => setEnableLockProfit(!enableLockProfit)} />
            Enable Lock Profit Logic
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
          Submit Order
        </button>

        {status && <p className={`mt-4 text-center text-sm ${status.includes("Error") ? "text-red-600" : "text-green-600"}`}>{status}</p>}
      </form>
    </div>
  );
}
